import { Download, Edit2, Trash2 , X, Check, CirclePlus} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import api from '../../utils/api'; 

interface Category { id: number; name: string; description: string; }
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

  useEffect(() => {
    const fetchCategories = async () => {
      try { const res = await api.get<Category[]>('/categories'); setCategories(res.data); }
      catch (error) { console.error("Error loading categories:", error); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      try { const res = await api.get<Expense[]>('/expenses'); setExpenses(res.data); }
      catch (error) { console.error("Error loading expenses:", error); }
    };
    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = selectedCategory === 'all' || expense.categoryId === Number(selectedCategory);
    const matchesDateRange = (!dateRange.start || expense.date >= dateRange.start) &&
                             (!dateRange.end || expense.date <= dateRange.end);
    return matchesCategory && matchesDateRange;
  });

  const handleDownloadReceipt = async (expenseId: number) => {
    try {
      const response = await fetch(`/api/receipt/${expenseId}`);
      if (!response.ok) throw new Error("Error downloading receipt");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
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

  const [type, setType] = useState<"OneTime" | "Recurring">("OneTime");
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', date: '', categoryId: '', type: 'OneTime', startDate: '', endDate: '' });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', newExpense.description);
    formData.append('amount', newExpense.amount);
    formData.append('date', newExpense.date);
    formData.append('categoryId', newExpense.categoryId);
    formData.append('type', type);
    if (type === 'Recurring') { formData.append('startDate', newExpense.startDate); formData.append('endDate', newExpense.endDate); }
    if (receiptFile) formData.append('receipt', receiptFile);

    try {
      await api.post("/expenses", formData, { headers: { "Content-Type": "multipart/form-data" } });
      window.location.reload();
      setShowAddExpense(false);
    } catch (err) { console.error(err); alert("Failed to add expense"); }
  };

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
      await api.put(`/expenses/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      window.location.reload();
      setEditingExpenseId(null);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    if (!id || isNaN(id)) { setDeleteConfirmId(null); return; }
    try {
      const response = await api.delete(`/expenses/${id}`);
      if (response.status >= 200 && response.status < 300) {
        setExpenses((prev) => prev.filter((e) => e.id !== id));
      } else { alert("Unable to delete this expense."); }
    } catch (err) { alert("Server error: unable to delete expense."); }
    finally { setDeleteConfirmId(null); }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[var(--color-bg)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Expense Tracking</h1>
          <p className="text-[var(--color-text-sub)]">Manage and track all your expenses</p>
        </div>
        <button
          onClick={() => setShowAddExpense(true)}
          className="flex gap-2 justify-between px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition mt-4 md:mt-0"
        >
          <CirclePlus /> New Expense
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow p-4 mb-6 border border-[var(--color-secondary-light)]/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-[var(--color-secondary-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="all">All categories</option>

              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">Start date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full p-2 border border-[var(--color-secondary-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">End date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full p-2 border border-[var(--color-secondary-light)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow overflow-hidden border border-[var(--color-secondary-light)]/20">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-[var(--color-bg)] border-b border-[var(--color-secondary-light)]/30">
              <tr>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-sub)] uppercase">Description</th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-sub)] uppercase">Type</th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-sub)] uppercase">Category</th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-sub)] uppercase">Date</th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-sub)] uppercase">Amount</th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-sub)] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-secondary-light)]/20">
              {filteredExpenses.map((expense) => {
                const category = categories.find((c) => c.id === expense.categoryId);
                const isEditing = editingExpenseId === expense.id;

                return (
                  <tr key={expense.id} className="hover:bg-[var(--color-secondary-light)]/5 transition">
                    {isEditing ? (
                      <>
                        {/* Inputs pour l'édition */}
                        <td className="px-6 py-4">
                          <input value={editingExpenseData.description || ''} onChange={e => setEditingExpenseData(prev => ({ ...prev, description: e.target.value }))} className="border border-[var(--color-secondary-light)] rounded p-1 w-full bg-[var(--color-bg)] text-[var(--color-text)]" />
                        </td>
                        <td className="px-6 py-4">
                          <select value={editingExpenseData.type || 'OneTime'} onChange={e => setEditingExpenseData(prev => ({ ...prev, type: e.target.value as 'OneTime'|'Recurring' }))} className="border border-[var(--color-secondary-light)] rounded p-1 w-full bg-[var(--color-bg)] text-[var(--color-text)]">
                            <option value="OneTime">One Time</option>
                            <option value="Recurring">Recurring</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <select value={editingExpenseData.categoryId || ''} onChange={e => setEditingExpenseData(prev => ({ ...prev, categoryId: Number(e.target.value) }))} className="border border-[var(--color-secondary-light)] rounded p-1 w-full bg-[var(--color-bg)] text-[var(--color-text)]">
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input type="date" value={editingExpenseData.date?.slice(0,10)||''} onChange={e => setEditingExpenseData(prev => ({ ...prev, date: e.target.value }))} className="border border-[var(--color-secondary-light)] rounded p-1 w-full bg-[var(--color-bg)] text-[var(--color-text)]"/>
                        </td>
                        <td className="px-6 py-4">
                          <input type="number" step="0.01" value={editingExpenseData.amount || ''} onChange={e => setEditingExpenseData(prev => ({ ...prev, amount: Number(e.target.value) }))} className="border border-[var(--color-secondary-light)] rounded p-1 w-full bg-[var(--color-bg)] text-[var(--color-text)]"/>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button onClick={() => handleUpdateExpense(expense.id)} className="px-2 py-1 bg-[var(--color-primary)] text-white text-sm rounded-lg hover:brightness-90">Save</button>
                          <button onClick={() => setEditingExpenseId(null)} className="px-2 py-1 bg-red-600 rounded-lg text-sm hover:opacity-90"><X className='w-4 h-4' /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-[var(--color-text)]">{expense.description}</td>
                        <td className="px-6 py-4 text-[var(--color-text)]">{expense.type}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-medium bg-[var(--color-primary)] text-white rounded-full">{category?.name || 'Inconnu'}</span>
                        </td>
                        <td className="px-6 py-4 text-[var(--color-text)]">{new Date(expense.date).toLocaleDateString('fr-FR')}</td>
                        <td className="px-6 py-4 text-[var(--color-text)] font-medium">{expense.amount.toFixed(2)} Ar</td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          {deleteConfirmId === expense.id ? (
                            <>
                              <button onClick={() => handleDelete(expense.id)} className="px-2 py-1 bg-red-600 text-white rounded hover:opacity-90"><Check className='w-4 h-4' /></button>
                              <button onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 bg-gray-300 rounded hover:opacity-90"><X className='w-4 h-4' /></button>
                            </>
                          ) : (
                            <>
                              {expense.receipt && (
                                <button onClick={() => handleDownloadReceipt(expense.id)} className="flex items-center gap-2 px-3 py-1 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 text-sm">
                                  <Download className="w-4 h-4" />
                                </button>
                              )}
                              <button onClick={() => { setEditingExpenseId(expense.id); setEditingExpenseData({ ...expense }); }} className="p-1 bg-[var(--color-primary)] text-white rounded hover:opacity-90"><Edit2 className="w-4 h-4"/></button>
                              <button onClick={() => setDeleteConfirmId(expense.id)} className="p-1 bg-[var(--color-expense)] text-white rounded hover:opacity-90"><Trash2 className="w-4 h-4"/></button>
                            </>
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

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[var(--color-bg-card)] rounded-xl p-6 w-full max-w-md shadow-lg border border-gray-300">
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">New Expense</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--color-text-sub)] mb-1">Description</label>
                <input 
                  type="text"
                  name="description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-xl bg-[var(--color-bg)] text-[var(--color-text)]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--color-text-sub)] mb-1">Categories</label>
                <select
                  name="categoryId"
                  value={newExpense.categoryId}
                  onChange={(e) => setNewExpense({ ...newExpense, categoryId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-xl bg-[var(--color-bg)] text-[var(--color-text)]"
                  required
                >
                  <option value="">-- Select a category --</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-[var(--color-text-sub)] mb-1">Amount (€)</label>
                <input 
                  type="number"
                  step="0.01"
                  name="amount"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-xl bg-[var(--color-bg)] text-[var(--color-text)]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--color-text-sub)] mb-1">Date</label>
                <input 
                  type="date"
                  name="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-xl bg-[var(--color-bg)] text-[var(--color-text)]"
                  required
                />
              </div>

              <select
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value as "OneTime" | "Recurring")}
                className="w-full p-2 border border-gray-300 rounded-xl bg-[var(--color-bg)] text-[var(--color-text)]"
              >
                <option value="OneTime">One Time</option>
                <option value="Recurring">Recurring</option>
              </select>

              {type === "Recurring" && (
                <>
                  <div>
                    <label className="block text-sm text-[var(--color-text-sub)] font-medium">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={newExpense.startDate || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, startDate: e.target.value })}
                      required
                      className="w-full p-2 border border-gray-300 rounded-xl bg-[var(--color-bg)] text-[var(--color-text)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--color-text-sub)] font-medium">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={newExpense.endDate || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, endDate: e.target.value })}
                      required
                      className="w-full p-2 border border-gray-300 rounded-xl bg-[var(--color-bg)] text-[var(--color-text)]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm text-[var(--color-text-sub)] mb-1">Receipt (PDF/Image)</label>
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
                  className="px-4 py-2 bg-[var(--color-alert)] text-[var(--color-text)] rounded-xl hover:brightness-95"
                >
                  <X className="w-4 h-4"/>
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:brightness-95"
                >
                  <Check className="w-4 h-4"/>
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
