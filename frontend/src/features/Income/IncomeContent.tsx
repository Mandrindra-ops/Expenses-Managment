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


  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[var(--color-bg)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Revenus du mois de{" "}
            {new Date().toLocaleString("fr-FR", { month: "long", year: "numeric" })}
          </h1>
          <p className="text-[var(--color-text-sub)]">Gérez et suivez toutes vos sources de revenus</p>
        </div>

        {mode === "list" && (
          <button
            onClick={handleOpenForm}
            className="px-4 py-2 bg-[var(--color-income)] text-white rounded-lg hover:brightness-90 transition mt-4 md:mt-0"
          >
            + Nouveau Revenu
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
                  <p className="text-sm font-medium text-[var(--color-text-sub)]">Total Revenus</p>
                  <p className="text-xl font-bold text-[var(--color-text)]">{totalAmount.toFixed(2)} €</p>
                </div>
              </div>
            </div>
            <div className="bg-[var(--color-bg-card)] rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm"><ChartNoAxesCombined /></span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-[var(--color-text-sub)]">Moyenne Mensuelle</p>
                  <p className="text-xl font-bold text-[var(--color-text)]">{monthlyAverage.toFixed(2)} €</p>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {incomes.map((income) => (
                  <tr key={income.id}>
                    <td>{income.description}</td>
                    <td>{income.source}</td>
                    <td>{new Date(income.date).toLocaleDateString("fr-FR")}</td>
                    <td>{income.amount} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* FORM CREATE */
        <div className="bg-[var(--color-bg-card)] rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Ajouter un revenu</h2>
          <form className="space-y-4">
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
                  Source
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Ex: Salaire"
                />
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
            
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={handleCancelForm} 
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Annuler
              </button>
              <button type="submit" className="px-4 py-2 bg-[var(--color-income)] text-white rounded">Enregistrer</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default IncomeContent;