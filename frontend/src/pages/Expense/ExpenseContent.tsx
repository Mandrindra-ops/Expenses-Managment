import React, { useState } from 'react';

interface Expense {
    id: number;
    title: string;
    amount: number;
    category: string;
    date: string;
    receipt: boolean;
}

const ExpenseContent: React.FC = () => {
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const categories = ['Nourriture', 'Transport', 'Loisirs', 'Logement', 'Santé', 'Shopping'];

    const expenses: Expense[] = [
    { id: 1, title: 'Courses supermarché', amount: 85.40, category: 'Nourriture', date: '2023-10-12', receipt: true },
    { id: 2, title: 'Essence voiture', amount: 60.00, category: 'Transport', date: '2023-10-11', receipt: false },
    { id: 3, title: 'Cinéma', amount: 24.50, category: 'Loisirs', date: '2023-10-10', receipt: true },
    { id: 4, title: 'Facture électricité', amount: 120.30, category: 'Logement', date: '2023-10-09', receipt: true },
    { id: 5, title: 'Médicaments', amount: 35.20, category: 'Santé', date: '2023-10-08', receipt: false },
    { id: 6, title: 'Nouvelle chemise', amount: 45.00, category: 'Shopping', date: '2023-10-07', receipt: true },
    ];

    const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    const matchesDateRange = (!dateRange.start || expense.date >= dateRange.start) && 
                            (!dateRange.end || expense.date <= dateRange.end);
    return matchesCategory && matchesDateRange;
    });

    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const handleDownloadReceipt = (expenseId: number) => {
    console.log(`Téléchargement du reçu pour la dépense ${expenseId}`);
    // Ici vous intégreriez la logique de téléchargement réel
    };

    const handleAddExpense = (expenseData: any) => {
    console.log('Nouvelle dépense:', expenseData);
    setShowAddExpense(false);
    };

    const handleAddCategory = (categoryName: string) => {
    console.log('Nouvelle catégorie:', categoryName);
    setShowAddCategory(false);
    };

    return (
    <div className="flex-1 overflow-y-auto p-6 bg-[var(--color-bg)]">
      {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">Gestion des Dépenses</h1>
        </div>
        <button
            onClick={() => setShowAddExpense(true)}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:brightness-90 transition mt-4 md:mt-0">+ Nouvelle Dépense
        </button>
        </div>

      {/* Filtres */}
        <div className="bg-[var(--color-bg-card)] rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtre par catégorie */}
            <div>
            <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">
                Catégorie
            </label>
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
            >
                <option value="all">Toutes les catégories</option>
                {categories.map(category => (
                <option key={category} value={category}>{category}</option>
                ))}
            </select>
            </div>

          {/* Filtre par date de début */}
            <div>
            <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">
                Date de début
            </label>
            <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            </div>

          {/* Filtre par date de fin */}
            <div>
            <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">
                Date de fin
            </label>
            <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            </div>
        </div>

        <div className="flex justify-between items-center mt-4">
            <button
            onClick={() => setShowAddCategory(true)}
            className="px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:brightness-90 transition"
            >
            + Nouvelle Catégorie
            </button>
        
            <div className="text-right">
            <p className="text-sm text-[var(--color-text-sub)]">Total filtré:</p>
            <p className="text-xl font-bold text-[var(--color-text)]">{totalAmount.toFixed(2)} €</p>
            </div>
        </div>
        </div>

      {/* Liste des dépenses */}
        <div className="bg-[var(--color-bg-card)] rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-[var(--color-bg)]">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase tracking-wider">
                    Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase tracking-wider">
                    Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase tracking-wider">
                    Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase tracking-wider">
                    Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase tracking-wider">
                    Actions
                </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-[var(--color-text)]">
                        {expense.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-[var(--color-primary)] text-white rounded-full">
                        {expense.category}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[var(--color-text)]">
                        {new Date(expense.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[var(--color-text)] font-medium">
                        {expense.amount.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    {expense.receipt && (
                        <button
                        onClick={() => handleDownloadReceipt(expense.id)}
                        className="px-3 py-1 bg-[var(--color-secondary)] text-white rounded-lg hover:brightness-90 transition text-sm"
                        >
                        📄 Reçu
                        </button>
                    )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>

      {/* Modal pour ajouter une dépense */}
        {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Nouvelle Dépense</h2>
            
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">
                    Description
                </label>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Ex: Courses supermarché"
                />
                </div>
            
                <div>
                <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">
                    Catégorie
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-lg">
                    {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                </div>
            
                <div>
                <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">
                    Montant (€)
                </label>
                <input
                    type="number"
                    step="0.01"
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
                    className="w-full p-2 border border-gray-300 rounded-lg"
                />
                </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
                <button
                onClick={() => setShowAddExpense(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                    Annuler
                </button>
                <button
                onClick={() => handleAddExpense({})}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg"
                >
                    Ajouter
                </button>
            </div>
            </div>
        </div>
        )}

      {/* Modal pour ajouter une catégorie */}
        {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Nouvelle Catégorie</h2>
            
            <div>
                <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">
                    Nom de la catégorie
                </label>
                <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Ex: Abonnements"
                />
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
                <button
                onClick={() => setShowAddCategory(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                    Annuler
                </button>
                <button
                onClick={() => handleAddCategory('Nouvelle catégorie')}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg"
                >
                    Créer
                </button>
            </div>
            </div>
        </div>
        )}
    </div>
    );
};

export default ExpenseContent;