import { ReceiptText } from 'lucide-react';
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
        console.error("Erreur lors du chargement des catégories :", error);
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
        console.error("Erreur lors du chargement des dépenses :", error);
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

  const handleDownloadReceipt = async (expenseId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/receipts/${expenseId}`, {
        method: 'GET',
      });
      if (!response.ok) throw new Error('Erreur lors du téléchargement du reçu');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;

      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = `receipt-${expenseId}.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) fileName = match[1];
      }
      a.download = fileName;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
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


  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[var(--color-bg)]">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Suivi des Dépenses</h1>
          <p className="text-[var(--color-text-sub)]">Gérez et suivez toutes vos dépenses</p>
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
              <option value="all">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">Date de début</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">Date de fin</label>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.map(expense => {
                const category = categories.find(c => c.id === expense.categoryId);
                return (
                  <tr key={expense.id}>
                    <td className="px-6 py-4 text-[var(--color-text)]">{expense.description}</td>
                    <td className="px-6 py-4 text-[var(--color-text)]">{expense.type}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-[var(--color-primary)] text-white rounded-full">
                        {category ? category.name : "Inconnu"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text)]">{new Date(expense.date).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4 text-[var(--color-text)] font-medium ">{expense.amount.toFixed(2)} €</td>
                    <td className="px-6 py-4">
                      {expense.receipt && (
                        <button
                          onClick={() => handleDownloadReceipt(expense.id)}
                          className="flex items-center gap-2 px-3 py-1 bg-[var(--color-secondary)] text-white rounded-lg hover:brightness-90 transition text-sm"
                        >
                          <ReceiptText className="w-4 h-4" /> Reçu
                        </button>
                      )}
                    </td>
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
              <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Nouvelle Dépense</h2>
              
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
                  <label className="block text-sm mb-1">Catégorie</label>
                  <select
                    name="categoryId"
                    value={newExpense.categoryId}
                    onChange={(e) => setNewExpense({ ...newExpense, categoryId: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">-- Choisir une catégorie --</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Montant (€)</label>
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
                  <label className="block text-sm mb-1">Reçu (PDF/Image)</label>
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
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg"
                  >
                    Ajouter
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
