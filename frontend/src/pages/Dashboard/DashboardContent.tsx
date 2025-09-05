const DashboardContent: React.FC = () => {
  // Données factices pour les dépenses récentes
  const recentExpenses = [
    { id: 1, category: 'Nourriture', description: 'Courses supermarché', amount: 85.40, date: '12 Oct 2023' },
    { id: 2, category: 'Transport', description: 'Essence voiture', amount: 60.00, date: '11 Oct 2023' },
    { id: 3, category: 'Loisirs', description: 'Cinéma', amount: 24.50, date: '10 Oct 2023' },
    { id: 4, category: 'Logement', description: 'Facture électricité', amount: 120.30, date: '9 Oct 2023' },
    { id: 5, category: 'Santé', description: 'Médicaments', amount: 35.20, date: '8 Oct 2023' },
  ];

  // Statistiques factices
  const stats = [
    { name: 'Dépenses ce mois', value: '1,245.40 €', change: '+12%', changeType: 'increase' },
    { name: 'Budget restant', value: '754.60 €', change: '-8%', changeType: 'decrease' },
    { name: 'Dépenses moyennes/jour', value: '41.51 €', change: '+5%', changeType: 'increase' },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-[var(--color-bg)]">
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 bg-[var(--color-bg-card)] rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-[var(--color-text)]">{stat.value}</span>
                <p className="text-sm font-medium text-[var(--color-text-sub)]">{stat.name}</p>
              </div>
              <div className="ml-auto">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  stat.changeType === 'increase' 
                    ? 'bg-green-100 text-[var(--color-income)]' 
                    : 'bg-red-100 text-[var(--color-expense)]'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Graphique des dépenses (placeholder) */}
        <div className="p-6 bg-[var(--color-bg-card)] rounded-lg shadow">
          <h2 className="text-lg font-medium text-[var(--color-text)] mb-4">Évolution des dépenses</h2>
          <div className="flex items-center justify-center h-64 bg-[var(--color-bg)] rounded-lg">
            <p className="text-[var(--color-text-sub)]">Graphique des dépenses mensuelles</p>
          </div>
        </div>

        {/* Dépenses par catégorie (placeholder) */}
        <div className="p-6 bg-[var(--color-bg-card)] rounded-lg shadow">
          <h2 className="text-lg font-medium text-[var(--color-text)] mb-4">Répartition par catégorie</h2>
          <div className="flex items-center justify-center h-64 bg-[var(--color-bg)] rounded-lg">
            <p className="text-[var(--color-text-sub)]">Graphique circulaire des catégories</p>
          </div>
        </div>
      </div>

      {/* Dépenses récentes */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-[var(--color-text)] mb-4">Dépenses récentes</h2>
        <div className="bg-[var(--color-bg-card)] shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentExpenses.map((expense) => (
              <li key={expense.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <div className="flex text-sm">
                        <p className="font-medium text-[var(--color-primary-teal)] truncate">{expense.description}</p>
                        <p className="ml-4 flex-shrink-0 font-normal text-[var(--color-text-sub)]">{expense.category}</p>
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-[var(--color-text-sub)]">
                          <p>{expense.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                      <div className="flex overflow-hidden">
                        <p className="text-sm font-medium text-[var(--color-text)]">{expense.amount.toFixed(2)} €</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0">
                    <svg className="h-5 w-5 text-[var(--color-text-sub)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;