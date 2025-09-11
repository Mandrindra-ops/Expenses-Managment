import { Edit2, Trash2, X , Check} from 'lucide-react';
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
  const [mode, setMode] = useState<"list" | "create">(initialMode || "list");
  const [incomes, setIncomes] = useState<Income[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Income>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    description: "",
    source: "",
    amount: "",
    date: "",
  });

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
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
        setIncomes(monthlyIncomes);
      } catch (err) {
        console.error("Erreur lors du fetch des revenus:", err);
      }
    };
    fetchIncomes();
  }, []);

  const handleOpenForm = () => { navigate("/dashboard/incomes/new"); setMode("create"); };
  const handleCancelForm = () => { navigate("/dashboard/incomes"); setMode("list"); };

  const totalAmount = incomes.reduce((sum, income) => sum + income.amount, 0);
  const monthlyAverage = incomes.length > 0 ? totalAmount / incomes.length : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      alert(err?.response?.data?.message || "Échec de l'ajout du revenu");
    }
  };

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

  const handleCancelEdit = () => { setEditingId(null); setEditForm({}); };

  const handleSaveEdit = async (id: number) => {
    if (!editingId) return;
    const desc = (editForm.description ?? "").trim();
    const src = (editForm.source ?? "").trim();
    const amt = parseFloat(String(editForm.amount ?? "0"));
    const dateStr = editForm.date;
    if (!desc || !src || !dateStr || isNaN(amt) || amt <= 0) { alert("Please fill all fields correctly."); return; }
    try {
      setIsSaving(true);
      const res = await api.put<Income>(`/incomes/${id}`, { description: desc, source: src, amount: amt, date: dateStr });
      const updated = res.data;
      const d = new Date(updated.date);
      const now = new Date();
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        setIncomes((prev) => prev.map((it) => (it.id === id ? updated : it)));
      } else {
        setIncomes((prev) => prev.filter((it) => it.id !== id));
      }
      setEditingId(null); setEditForm({});
    } catch (err: any) { alert(err?.response?.data?.message || "Update failed"); }
    finally { setIsSaving(false); }
  };

  const handleStartDelete = (id: number) => { setDeletingId(id); if (editingId === id) handleCancelEdit(); };
  const handleCancelDelete = () => setDeletingId(null);
  const handleConfirmDelete = async (id: number) => {
    try { await api.delete(`/incomes/${id}`); setIncomes((prev) => prev.filter((i) => i.id !== id)); }
    catch (err: any) { alert(err?.response?.data?.message || "Suppression échouée"); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="flex-1 overscroll-y-auto p-6 bg-[var(--color-bg)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Incomes for {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
          </h1>
          <p className="text-[var(--color-text-sub)]">Manage your income sources</p>
        </div>
        {mode === "list" && (
          <button onClick={handleOpenForm} className="mt-4 md:mt-0 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition">
            + New Income
          </button>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { title: "Total Income", value: totalAmount, icon: <BanknoteArrowDown className="w-5 h-5 text-white" />, color: "bg-[var(--color-income)]" },
          { title: "Monthly Average", value: monthlyAverage, icon: <ChartNoAxesCombined className="w-5 h-5 text-white" />, color: "bg-[var(--color-primary)]" },
        ].map((card) => (
          <div key={card.title} className="bg-[var(--color-bg-card)] rounded-lg shadow p-5 flex items-center gap-4 border border-gray-300">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${card.color}`}>{card.icon}</div>
            <div>
              <p className="text-sm text-[var(--color-text-sub)]">{card.title}</p>
              <p className="font-semibold text-[var(--color-text)]">{card.value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g," ")} Ar</p>
            </div>
          </div>
        ))}
      </div>

      {mode === "list" ? (
        /* Table */
        <div className="bg-[var(--color-bg-card)] rounded-lg shadow overflow-hidden border border-[var(--color-secondary-light)]/20">
          <table className="w-full">
            <thead className="bg-[var(--color-bg)] border-b border-[var(--color-secondary-light)]/30">
              <tr>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-sub)] uppercase">Description</th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-sub)] uppercase">Source</th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-sub)] uppercase">Date</th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-sub)] uppercase">Amount</th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-sub)] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-secondary-light)]/5 transition text-[var(--color-text)]">
              {incomes.map((income) => (
                <tr key={income.id} className="border border-gray-300 rounded-lg mb-2 overflow-hidden">
                  <td className="px-6 py-4">{editingId === income.id ? <input name="description" value={editForm.description ?? ""} onChange={handleEditChange} className="w-full border rounded-lg py-2 px-3 text-sm" /> : income.description}</td>
                  <td className="px-6 py-4">{editingId === income.id ? <input name="source" value={editForm.source ?? ""} onChange={handleEditChange} className="w-full border rounded-lg py-2 px-3 text-sm" /> : <span className="px-3 py-1 text-xs bg-[var(--color-income)] text-white rounded-2xl">{income.source}</span>}</td>
                  <td className="px-6 py-4">{editingId === income.id ? <input type="date" name="date" value={formatDateForInput(editForm.date ?? income.date)} onChange={handleEditChange} className="w-full border rounded-lg py-2 px-3 text-sm" /> : new Date(income.date).toLocaleDateString("fr-FR")}</td>
                  <td className="px-6 py-4">{editingId === income.id ? <input type="number" step="0.01" name="amount" value={editForm.amount ?? String(income.amount)} onChange={handleEditChange} className="w-full border rounded-lg py-2 px-3 text-sm" /> : `${income.amount.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ar`}</td>
                  <td className="px-6 py-4">
                    {editingId === income.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleSaveEdit(income.id)} disabled={isSaving} className="px-2 py-1 bg-green-600 text-white rounded-lg text-sm hover:brightness-90">{isSaving ? "Saving..." : "Save"}</button>
                        <button onClick={handleCancelEdit} disabled={isSaving} className="px-2 py-1 bg-red-600 rounded-lg text-sm hover:brightness-90"><X className='w-4 h-4' /></button>
                      </div>
                    ) : deletingId === income.id ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleConfirmDelete(income.id)} className="px-2 py-1 bg-red-600 text-white rounded-lg text-sm hover:brightness-90"><Check className='w-4 h-4' /></button>
                        <button onClick={handleCancelDelete} className="px-2 py-1 bg-gray-300 rounded-lg text-sm hover:brightness-90"><X className="w-4 h-4"/></button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(income)} className="p-1 bg-[var(--color-primary)] text-white rounded text-sm hover:brightness-90"><Edit2 className="w-4 h-4"/></button>
                        <button onClick={() => handleStartDelete(income.id)} className="p-1 bg-[var(--color-expense)] text-white rounded text-sm hover:brightness-90"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      ) : (
        /* Form */
        <div className="bg-[var(--color-bg-card)] rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Add Income</h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            {["description","source","amount","date"].map((field) => (
              <div key={field}>
                <label className="block text-sm text-[var(--color-text-sub)] mb-1 capitalize">{field==="amount"?"Amount (Ar)":field}</label>
                <input type={field==="amount"?"number":field==="date"?"date":"text"} name={field} value={(formData as any)[field]} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)]" step={field==="amount"?"0.01":undefined} />
              </div>
            ))}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={handleCancelForm} className="px-3 py-1 bg-[var(--color-alert)] rounded-lg text-sm hover:brightness-95"><X className='w-4 h-4' /></button>
              <button type="submit" className="px-3 py-1 bg-[var(--color-income)] text-white rounded-lg text-sm hover:brightness-95"><Check className='w-4 h-4' /></button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default IncomeContent;
