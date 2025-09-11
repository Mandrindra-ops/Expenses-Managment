import { Download, Edit2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import api from '../../utils/api'; 

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Expense {
  id: number;
  amount: number;
  date: string;
  description: string;
  type: 'OneTime' | 'Recurring';
  receipt?: string;
  startDate?: string;
  endDate?: string;
  categoryId: number;
}

const ExpenseContent: React.FC = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get<Category[]>('/categories');
        setCategories(res.data);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Charger les dépenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get<Expense[]>('/expenses');
        setExpenses(res.data);
      } catch (error) {
        console.error("Error loading expenses:", error);
      }
    };
    fetchExpenses();
  }, []);

  // Filtrer les dépenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory =
      selectedCategory === 'all' || expense.categoryId === Number(selectedCategory);

    const matchesDateRange =
      (!dateRange.start || expense.date >= dateRange.start) &&
      (!dateRange.end || expense.date <= dateRange.end);

    return matchesCategory && matchesDateRange;
  });

  // Fonction utilitaire pour télécharger le reçu
const handleDownloadReceipt = async (expenseId: number) => {
  try {
    const response = await fetch(`/api/receipt/${expenseId}`);
    if (!response.ok) {
      throw new Error("Error downloading receipt");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Ici on laisse le backend donner le vrai nom du fichier
    const disposition = response.headers.get("Content-Disposition");
    let fileName = `receipt-${expenseId}.pdf`;

    if (disposition && disposition.includes("filename=")) {
      fileName = disposition.split("filename=")[1].replace(/"/g, "");
    }

    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erreur download:", error);
    alert("Unable to download the receipt!");
  }
};

  // Handle add
  // State pour les champs du form
const [type, setType] = useState<"OneTime" | "Recurring">("OneTime");

const [newExpense, setNewExpense] = useState({
  description: '',
  amount: '',
  date: '',
  categoryId: '',
  type: 'OneTime',
});
const [receiptFile, setReceiptFile] = useState<File | null>(null);

// Fonction pour envoyer l’expense
 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Création de FormData
  const formData = new FormData();
  formData.append('description', newExpense.description);
  formData.append('amount', newExpense.amount);
  formData.append('date', newExpense.date);
  formData.append('categoryId', newExpense.categoryId);
  formData.append('type', type);

  if (type === 'Recurring') {
    formData.append('startDate', newExpense.startDate || '');
    formData.append('endDate', newExpense.endDate || '');
  }

  if (receiptFile) {
    formData.append('receipt', receiptFile); // Multer attend ce champ
  }

  try {
    await api.post("/expenses", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    window.location.reload();
    setShowAddExpense(false); // Fermer le modal après succès
  } catch (err) {
    console.error(err);
    alert("Failed to add expense");
  }
};

// handle edit and delete
const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
const [editingExpenseData, setEditingExpenseData] = useState<Partial<Expense>>({});
const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);


const handleUpdateExpense = async (id: number) => {
  try {
    const formData = new FormData();
    formData.append('description', editingExpenseData.description || '');
    formData.append('amount', String(editingExpenseData.amount || 0));
    formData.append('date', editingExpenseData.date || '');
    formData.append('categoryId', String(editingExpenseData.categoryId || 0));
    formData.append('type', editingExpenseData.type || 'OneTime');
    if (editingExpenseData.startDate) formData.append('startDate', editingExpenseData.startDate);
    if (editingExpenseData.endDate) formData.append('endDate', editingExpenseData.endDate);
    if (receiptFile) formData.append('receipt', receiptFile);

    const response = await api.put(`/expenses/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    window.location.reload();
    setEditingExpenseId(null);
  } catch (err) {
    console.error(err);
  }
};


const handleDelete = async (id: number) => {
  if (!id || isNaN(id)) {
    console.error("Invalid expense ID:", id);
    setDeleteConfirmId(null);
    return;
  }

  try {
    const response = await api.delete(`/expenses/${id}`);

    if (response.status >= 200 && response.status < 300) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } else {
      console.error("Error during deletion, status:", response.status);
      alert("Unable to delete this expense.");
    }
  } catch (err) {
    console.error("Error during deletion:", err);
    alert("Server error: unable to delete expense.");
  } finally {
    setDeleteConfirmId(null); // Toujours réinitialiser le mini-modal
  }
};



  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[var(--color-bg)]">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Expense Tracking</h1>
          <p className="text-[var(--color-text-sub)]">Manage and track all your expenses</p>
        </div>
        <button
          onClick={() => setShowAddExpense(true)}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:brightness-90 transition mt-4 md:mt-0"
        >
          + New Expense
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">Catégorie</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="all">All categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">Start date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">End date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>
      </div>

      {/* Liste des dépenses */}
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-bg)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.map((expense) => {
                const category = categories.find((c) => c.id === expense.categoryId);
                const isEditing = editingExpenseId === expense.id;

                return (
                  <tr key={expense.id}>
                    {isEditing ? (
                      <>
                        {/* Description */}
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editingExpenseData.description || ''}
                            onChange={(e) =>
                              setEditingExpenseData((prev) => ({ ...prev, description: e.target.value }))
                            }
                            className="border rounded p-1 w-full"
                          />
                        </td>

                        {/* Type */}
                        <td className="px-6 py-4">
                          <select
                            value={editingExpenseData.type || 'OneTime'}
                            onChange={(e) =>
                              setEditingExpenseData((prev) => ({ ...prev, type: e.target.value as 'OneTime' | 'Recurring' }))
                            }
                            className="border rounded p-1 w-full"
                          >
                            <option value="OneTime">One Time</option>
                            <option value="Recurring">Recurring</option>
                          </select>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <select
                            value={editingExpenseData.categoryId || ''}
                            onChange={(e) =>
                              setEditingExpenseData((prev) => ({ ...prev, categoryId: Number(e.target.value) }))
                            }
                            className="border rounded p-1 w-full"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4">
                          <input
                            type="date"
                            value={editingExpenseData.date?.slice(0, 10) || ''}
                            onChange={(e) =>
                              setEditingExpenseData((prev) => ({ ...prev, date: e.target.value }))
                            }
                            className="border rounded p-1 w-full"
                          />
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            step="0.01"
                            value={editingExpenseData.amount || ''}
                            onChange={(e) =>
                              setEditingExpenseData((prev) => ({ ...prev, amount: Number(e.target.value) }))
                            }
                            className="border rounded p-1 w-full"
                          />
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 flex gap-2">
                          {editingExpenseData.type === 'Recurring' && (
                            <>
                              <input
                                type="date"
                                value={editingExpenseData.startDate || ''}
                                onChange={(e) =>
                                  setEditingExpenseData((prev) => ({ ...prev, startDate: e.target.value }))
                                }
                                className="border rounded p-1 w-full"
                              />
                              <input
                                type="date"
                                value={editingExpenseData.endDate || ''}
                                onChange={(e) =>
                                  setEditingExpenseData((prev) => ({ ...prev, endDate: e.target.value }))
                                }
                                className="border rounded p-1 w-full"
                              />
                            </>
                          )}

                          <input
                            type="file"
                            onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                            className="border rounded p-1 w-full"
                          />

                          <button
                            onClick={() => handleUpdateExpense(expense.id)}
                            className="px-2 py-1 bg-green-500 text-white rounded hover:brightness-90"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingExpenseId(null)}
                            className="px-2 py-1 bg-gray-400 text-white rounded hover:brightness-90"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        {/* Affichage normal */}
                        <td className="px-6 py-4 text-[var(--color-text)]">{expense.description}</td>
                        <td className="px-6 py-4 text-[var(--color-text)]">{expense.type}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-medium bg-[var(--color-primary)] text-white rounded-full">
                            {category ? category.name : 'Inconnu'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[var(--color-text)]">
                          {new Date(expense.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-[var(--color-text)] font-medium">
                          {expense.amount.toFixed(2)} €
                        </td>
                        <td className="px-6 py-4 flex items-center gap-2">
                            {/* Delete: si on est en mode confirmation on affiche Confirm/Cancel sans les bouttons ,
                                sinon on affiche l'icône poubelle.*/}
                            {deleteConfirmId === expense.id ? (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleDelete(expense.id)}
                                  className="px-2 py-1 bg-red-600 text-white rounded hover:brightness-90"
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-1 bg-gray-400 text-white rounded hover:brightness-90"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div  className="px-6 py-4 flex items-center gap-2">
                                {expense.receipt && (
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadReceipt(expense.id)}
                                    className="flex items-center gap-2 px-3 py-1 bg-[var(--color-secondary)] text-white rounded-lg hover:brightness-90 transition text-sm"
                                    aria-label={`Download receipt ${expense.id}`}
                                  >
                                    <Download className="w-4 h-4" /> Receipt
                                  </button>
                                )}
                                <button
                                type="button"
                                onClick={() => {
                                  setEditingExpenseId(expense.id);
                                  setEditingExpenseData({ ...expense });
                                }}
                                className="p-1 bg-blue-500 text-white rounded hover:brightness-90"
                                aria-label={`Edit ${expense.id}`}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(expense.id)}
                                  className="p-1 bg-red-500 text-white rounded hover:brightness-90"
                                  aria-label={`Delete ${expense.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            )}
                          </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddExpense && (
          <div className="fixed inset-0 flou flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">New expense</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Description</label>
                  <input 
                    type="text"
                    name="description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Categories</label>
                  <select
                    name="categoryId"
                    value={newExpense.categoryId}
                    onChange={(e) => setNewExpense({ ...newExpense, categoryId: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">-- Select a category --</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Amount (€)</label>
                  <input 
                    type="number"
                    step="0.01"
                    name="amount"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Date</label>
                  <input 
                    type="date"
                    name="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <select
                  name="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as "OneTime" | "Recurring")}
                  className="w-full p-2 border rounded"
                >
                  <option value="OneTime">One Time</option>
                  <option value="Recurring">Recurring</option>
                </select>

                {type === "Recurring" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={newExpense.startDate || ''}
                        onChange={(e) => setNewExpense({ ...newExpense, startDate: e.target.value })}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={newExpense.endDate || ''}
                        onChange={(e) => setNewExpense({ ...newExpense, endDate: e.target.value })}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </>
                )}


                <div>
                  <label className="block text-sm mb-1">Receipt (PDF/Image)</label>
                  <input 
                    type="file"
                    name="receipt"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                    className="w-full"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setShowAddExpense(false)} 
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

    </div>
  );
};

export default ExpenseContent;
