import React from "react";
import {
  Chart as ChartJS,
  type ChartData,
  ArcElement,
  Legend,
  Tooltip,
  LinearScale,
  BarElement,
  Title,
  CategoryScale,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import useDashboardData from "../../hooks/useDashboardData";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const DashboardContent: React.FC = () => {
  const { expenses, stats, loading, error, categories, refetch } =
    useDashboardData();

  if (loading) return <p className="p-6">Loading...</p>;
  if (error)
    return (
      <div className="p-6 text-red-500">
        Error: {error}
        <div className="mt-2">
          <button
            onClick={() => refetch()}
            className="px-3 py-1 rounded bg-[var(--color-primary-teal)] text-white"
          >
            Reload
          </button>
        </div>
      </div>
    );

  const DoughnutOptions = {
    plugins: {
      legend: {
        display: false, // supprime la légende
      },
    },
  };

  const BarOptions = {
    plugins: {
      legend: {
        display: false, // supprime la légende
      },
    },
    scales: {
      x: {
        ticks: {
          display: false, // supprime les ticks de l'axe X
        },
        grid: {
          drawTicks: false, // supprime les ticks physiques
        },
      },
      y: {
        ticks: {
          display: false, // supprime les ticks de l'axe Y
        },
        grid: {
          drawTicks: false,
        },
      },
    },
  };

  const BarData: ChartData<"bar"> = {
    labels: stats.map((v) => (v.changeType === "increase" ? v.name : "-")),
    datasets: [
      {
        label: "Evolution",
        data: stats.map((v) => parseFloat(v.value.replace(/[^\d.-]/g, ""))),
        borderWidth: 2,
        backgroundColor: ["#45deAe"],
      },
    ],
  };

  const ExpenseData = [];

  for (const category of categories) {
    ExpenseData.push({
      category: category.name,
      value: expenses
        .filter((e) => e.categoryId === category.id)
        .map((e) => e.amount),
    });
  }

  const DoughnutData: ChartData<"doughnut"> = {
    labels: ExpenseData.map((v) => v.category),
    datasets: [
      {
        label: "Expenses (Ar)",
        data: ExpenseData.map((v) =>
          parseFloat(v.value.reduce((a, b) => a + b, 0).toFixed(3))
        ),
        borderWidth: 2,
        hoverOffset: 5,
        backgroundColor: [
          "#fe57Fe",
          "#45deAe",
          "#52E00A",
          "#FFA000",
          "#5001AA",
          "#1D4ED8",
          "#3B82F6",
          "#60A5FA",
          "#F43F5E",
          "#22C55E",
          "#FACC15",
          "#D97706",
          "#16A34A",
          "#0D9488",
          "#14B8A6",
        ],
      },
    ],
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-[var(--color-bg)]">
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="p-6 bg-[var(--color-bg-card)] rounded-lg shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-[var(--color-text)]">
                  {stat.value}
                </span>
                <p className="text-sm font-medium text-[var(--color-text-sub)]">
                  {stat.name}
                </p>
              </div>
              <div className="ml-auto">
                <span
                  className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                    stat.changeType === "increase"
                      ? "bg-green-100 text-[var(--color-income)]"
                      : "bg-red-100 text-[var(--color-expense)]"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-[var(--color-bg-card)] rounded-lg shadow">
          <h2 className="text-lg font-medium text-[var(--color-text)] mb-4">
            Expense Trends
          </h2>
          <div className="flex items-center justify-center flex-2">
            <Bar key="bar-chart" data={BarData} options={BarOptions} />
          </div>
        </div>

        <div className="p-6 bg-[var(--color-bg-card)] rounded-lg shadow">
          <h2 className="text-lg font-medium text-[var(--color-text)] mb-4">
            Distribution by Category
          </h2>
          <div className="flex items-center justify-center h-64">
            <Doughnut
              key="doughnut-chart"
              data={DoughnutData}
              options={DoughnutOptions}
            />
          </div>
        </div>
      </div>

      {/* Recent expenses */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-[var(--color-text)] mb-4">
          Recent Expenses
        </h2>
        <div className="bg-[var(--color-bg-card)] shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {expenses.map((expense) => (
              <li key={expense.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <div className="flex text-sm">
                        <p className="font-medium text-[var(--color-primary-teal)] truncate">
                          {expense.description}
                        </p>
                        <p className="ml-4 flex-shrink-0 font-normal text-[var(--color-text-sub)]">
                          {expense.categoryId}
                        </p>
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-[var(--color-text-sub)]">
                          <p>{expense.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {expense.amount.toFixed(3) ?? 0} Ar
                      </p>
                    </div>
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
