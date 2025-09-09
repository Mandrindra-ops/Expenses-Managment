import { BanknoteArrowDown, ChartNoAxesCombined, RefreshCcw, Zap } from 'lucide-react';
import React, { useState } from 'react';

interface Income {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  recurring: boolean;
  frequency?: string;
}

const IncomeContent: React.FC = () => {
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const categories = ['Salaire', 'Freelance', 'Investissements', 'Location', 'Cadeaux', 'Autre'];
  const frequencyOptions = ['Mensuel', 'Trimestriel', 'Annuel', 'Ponctuel'];
  
  const incomes: Income[] = [
    { id: 1, title: 'Salaire principal', amount: 2500, category: 'Salaire', date: '2023-10-31', recurring: true, frequency: 'Mensuel' },
    { id: 2, title: 'Projet freelance', amount: 1200, category: 'Freelance', date: '2023-10-25', recurring: false },
    { id: 3, title: 'Dividendes actions', amount: 350, category: 'Investissements', date: '2023-10-20', recurring: true, frequency: 'Trimestriel' },
    { id: 4, title: 'Location appartement', amount: 800, category: 'Location', date: '2023-10-05', recurring: true, frequency: 'Mensuel' },
    { id: 5, title: 'Cadeau anniversaire', amount: 150, category: 'Cadeaux', date: '2023-10-15', recurring: false },
  ];

  const filteredIncomes = incomes.filter(income => {
    const matchesCategory = selectedCategory === 'all' || income.category === selectedCategory;
    const matchesDateRange = (!dateRange.start || income.date >= dateRange.start) && 
                            (!dateRange.end || income.date <= dateRange.end);
    return matchesCategory && matchesDateRange;
  });

  const totalAmount = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
  const monthlyAverage = totalAmount / 3; // Simplifié pour l'exemple

  const handleAddIncome = (incomeData: any) => {
    console.log('Nouveau revenu:', incomeData);
    setShowAddIncome(false);
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
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Suivi des Revenus</h1>
          <p className="text-[var(--color-text-sub)]">Gérez et suivez toutes vos sources de revenus</p>
        </div>
        <button
          onClick={() => setShowAddIncome(true)}
          className="px-4 py-2 bg-[var(--color-income)] text-white rounded-lg hover:brightness-90 transition mt-4 md:mt-0"
        >
          + Nouveau Revenu
        </button>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[var(--color-bg-card)] rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-[var(--color-income)] rounded-full flex items-center justify-center">
                <span className="text-white text-sm"><BanknoteArrowDown /></span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[var(--color-text-sub)]">Total Revenus</p>
              <p className="text-xl font-bold text-[var(--color-text)]">{totalAmount.toFixed(2)} €</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-card)] rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                <span className="text-white text-sm"><ChartNoAxesCombined /></span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[var(--color-text-sub)]">Moyenne Mensuelle</p>
              <p className="text-xl font-bold text-[var(--color-text)]">{monthlyAverage.toFixed(2)} €</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-card)] rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-[var(--color-secondary)] rounded-full flex items-center justify-center">
                <span className="text-white text-sm"><RefreshCcw /></span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[var(--color-text-sub)]">Revenus Récurrents</p>
              <p className="text-xl font-bold text-[var(--color-text)]">
                {incomes.filter(income => income.recurring).length}
              </p>
            </div>
          </div>
        </div>
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
          <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setShowAddCategory(true)}
            className="px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:brightness-90 transition"
          >
            + Nouvelle Catégorie
          </button>
        </div>
        </div>
      </div>

      {/* Liste des revenus */}
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
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase tracking-wider">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIncomes.map((income) => (
                <tr key={income.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-[var(--color-text)]">
                    {income.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-[var(--color-income)] text-white rounded-full">
                      {income.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[var(--color-text)]">
                    {new Date(income.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {income.recurring ? (
                      <span className="flex items-center gap-2 px-2 py-1 text-xs font-medium bg-[var(--color-primary)] text-white rounded-full">
                        <RefreshCcw /> {income.frequency}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 px-2 py-1 text-xs font-medium bg-[var(--color-secondary)] text-white rounded-full">
                        <Zap /> Ponctuel
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[var(--color-text)] font-medium text-green-600">
                    +{income.amount.toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal pour ajouter un revenu */}
      {showAddIncome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Nouveau Revenu</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">
                  Description
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Ex: Salaire octobre"
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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="recurring"
                  className="mr-2 h-4 w-4 text-[var(--color-primary)]"
                />
                <label htmlFor="recurring" className="text-sm text-[var(--color-text)]">
                  Revenu récurrent
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-sub)] mb-1">
                  Fréquence
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-lg">
                  {frequencyOptions.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddIncome(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={() => handleAddIncome({})}
                className="px-4 py-2 bg-[var(--color-income)] text-white rounded-lg"
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
              <label className="block text-sm text-[var(--color-text-sub)] mb-1">Nom de la catégorie</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Ex: Abonnements" />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowAddCategory(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Annuler</button>
              <button onClick={() => handleAddCategory('Nouvelle catégorie')} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg">Créer</button>
            </div>
          </div>
        </div>
      )}

    </div>

  );
};

export default IncomeContent;