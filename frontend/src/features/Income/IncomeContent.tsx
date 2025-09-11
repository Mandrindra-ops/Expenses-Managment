import { BanknoteArrowDown, ChartNoAxesCombined } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import api from "../../utils/api";

interface Income {
  id: number;
  source: string;
  description: string;
  date: string;
  amount: number;
}

interface IncomeContentProps {
  mode?: "list" | "create";
}

const IncomeContent: React.FC<IncomeContentProps> = ({ mode: initialMode }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"list" | "create">("list");
  const [incomes, setIncomes] = useState<Income[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Income>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const res = await api.get<Income[]>("/incomes");
        const data = res.data;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyIncomes = data.filter((income) => {
          const d = new Date(income.date);
          return (
            d.getMonth() === currentMonth && d.getFullYear() === currentYear
          );
        });

        setIncomes(monthlyIncomes);
      } catch (err) {
        console.error("Erreur lors du fetch des revenus:", err);
      }
    };

    fetchIncomes();
  }, []);
  
  const handleOpenForm = () => {
    navigate("/dashboard/incomes/new"); 
    setMode("create")
  };

  const handleCancelForm = () => {
    navigate("/dashboard/incomes"); 
    setMode("list")
  };

  const totalAmount = incomes.reduce((sum, income) => sum + income.amount, 0);
  const monthlyAverage = incomes.length > 0 ? totalAmount / incomes.length : 0;

  const [formData, setFormData] = useState({
    description: "",
    source: "",
    amount: "",
    date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<Income>("/incomes", {
        description: formData.description,
        source: formData.source,
        amount: parseFloat(formData.amount),
        date: formData.date,
      });

      setIncomes((prev) => [...prev, res.data]);
      setFormData({ description: "", source: "", amount: "", date: "" });
      handleCancelForm();
    } catch (err: any) {
      if (err.response) {
        console.error("Backend error:", err.response.data);
        console.error("Status:", err.response.status);
      } else {
        console.error("Erreur inconnue:", err.message);
      }
    }
  };

  // Handling edit
  const formatDateForInput = (d?: string) => {
    if (!d) return "";
    const date = new Date(d);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleEditClick = (income: Income) => {
    setEditingId(income.id);
    setEditForm({
      description: income.description,
      source: income.source,
      amount: String(income.amount), 
      date: formatDateForInput(income.date),
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (id: number) => {
    if (!editingId) return;
    
    const desc = (editForm.description ?? "").trim();
    const src = (editForm.source ?? "").trim();
    const amt = parseFloat(String(editForm.amount ?? "0"));
    const dateStr = editForm.date;

    if (!desc || !src || !dateStr || isNaN(amt) || amt <= 0) {
      alert("Please fill all fields correctly."); 
      return;
    } // need test and delete after that the alert to improve the design

    const payload = {
      description: desc,
      source: src,
      amount: amt,
      date: dateStr, 
    };

    try {
      setIsSaving(true);
      const res = await api.put<Income>(`/incomes/${id}`, payload);
      const updated = res.data;

      const d = new Date(updated.date);
      const now = new Date();
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        setIncomes((prev) => prev.map((it) => (it.id === id ? updated : it)));
      } else {
        setIncomes((prev) => prev.filter((it) => it.id !== id));
      }

      setEditingId(null);
      setEditForm({});
    } catch (err: any) {
      console.error("Update error:", err.response ?? err);

      const msg = err?.response?.data?.message || "Update failed";
      alert(msg); // need test and delete after that the alert to improve the design
    } finally {
      setIsSaving(false);
    }
  };

    const handleStartDelete = (id: number) => {
      setDeletingId(id);
      if (editingId === id) handleCancelEdit();
    };

    const handleCancelDelete = () => {
      setDeletingId(null);
    };

    const handleConfirmDelete = async (id: number) => {
      try {
        await api.delete(`/incomes/${id}`);
        setIncomes((prev) => prev.filter((income) => income.id !== id));
      } catch (err: any) {
        console.error("Delete error:", err.response ?? err);
        const msg = err?.response?.data?.message || "Suppression échouée";
        alert(msg); // need test and delete after that the alert to improve the design
      } finally {
        setDeletingId(null);
      }
    };


  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[var(--color-bg)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Incomes for{" "}
            {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
          </h1>
          <p className="text-[var(--color-text-sub)]">Manage and track all your sources of income</p>
        </div>

        {mode === "list" && (
          <button
            onClick={handleOpenForm}
            className="px-4 py-2 bg-[var(--color-income)] text-white rounded-lg hover:brightness-90 transition mt-4 md:mt-0"
          >
            + New Income
          </button>
        )}
      </div>

       {/* Cartes de stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-[var(--color-bg-card)] rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[var(--color-income)] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm"><BanknoteArrowDown /></span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-[var(--color-text-sub)]">Total Income</p>
                  <p className="text-xl font-bold text-[var(--color-text)]">{totalAmount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Ar</p>
                </div>
              </div>
            </div>
            <div className="bg-[var(--color-bg-card)] rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm"><ChartNoAxesCombined /></span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-[var(--color-text-sub)]">Monthly Average</p>
                  <p className="text-xl font-bold text-[var(--color-text)]">{monthlyAverage.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Ar</p>
                </div>
              </div>
            </div>
          </div>

      {mode === "list" ? (
        <>
          {/* Table des revenus */}
          <div className="bg-[var(--color-bg-card)] rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-[var(--color-bg)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {incomes.map((income) => (
                  <tr key={income.id}>
                    <td className="px-6 py-4">
                      {editingId === income.id ? (
                        <input
                          name="description"
                          value={(editForm.description ?? "") as string}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        income.description
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {editingId === income.id ? (
                        <input
                          name="source"
                          value={(editForm.source ?? "") as string}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-[var(--color-income)] text-white rounded-full">{income.source}</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {editingId === income.id ? (
                        <input
                          type="date"
                          name="date"
                          value={formatDateForInput(editForm.date ?? income.date)}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        new Date(income.date).toLocaleDateString("fr-FR")
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {editingId === income.id ? (
                        <input
                          type="number"
                          step="0.01"
                          name="amount"
                          value={(editForm.amount ?? String(income.amount)) as any}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        `${income.amount.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ar`
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {editingId === income.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(income.id)}
                            disabled={isSaving}
                            className="px-3 py-1 bg-green-600 text-white rounded"
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className="px-3 py-1 bg-gray-300 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : deletingId === income.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConfirmDelete(income.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={handleCancelDelete}
                            className="px-3 py-1 bg-gray-300 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(income)}
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleStartDelete(income.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </>
      ) : (
        /* FORM CREATE */
        <div className="bg-[var(--color-bg-card)] rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Add income</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Ex: October salary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">
                Source
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Ex: Salary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">
                Amount (Ar)
              </label>
              <input
                type="number"
                step="0.01"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={handleCancelForm} 
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-[var(--color-income)] text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default IncomeContent;