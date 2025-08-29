import { EyeIcon, PlaneIcon, UtensilsIcon, CodeIcon, ShoppingBagIcon, CalendarIcon } from '@heroicons/react/24/solid'; // Note: Some icons are placeholders; adjust as needed

interface Expense {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  amount: string;
  date: string;
  status: string;
  statusColor: string;
  project: string;
}

const expenses: Expense[] = [
  {
    icon: <PlaneIcon className="h-6 w-6" />,
    title: 'Flight to Client Meeting',
    description: 'Business trip to TechCorp headquarters',
    category: 'Travel',
    amount: '€485.50',
    date: '15/11/2024',
    status: 'Submitted',
    statusColor: 'bg-orange-100 text-orange-600',
    project: 'Website Redesign',
  },
  {
    icon: <UtensilsIcon className="h-6 w-6" />,
    title: 'Team Lunch',
    description: 'Quarterly team lunch',
    category: 'Meals',
    amount: '€125.00',
    date: '14/11/2024',
    status: 'Approved',
    statusColor: 'bg-green-100 text-green-600',
    project: '-',
  },
  {
    icon: <CodeIcon className="h-6 w-6" />,
    title: 'Adobe Creative Suite',
    description: 'Monthly subscription for design tools',
    category: 'Software',
    amount: '€59.99',
    date: '01/11/2024',
    status: 'Paid',
    statusColor: 'bg-green-100 text-green-600',
    project: 'Website Redesign',
  },
  {
    icon: <ShoppingBagIcon className="h-6 w-6" />,
    title: 'Office Supplies',
    description: 'Notebooks, pens, sticky notes',
    category: 'Office',
    amount: '€47.25',
    date: '13/11/2024',
    status: 'Submitted',
    statusColor: 'bg-orange-100 text-orange-600',
    project: '-',
  },
  {
    icon: <CalendarIcon className="h-6 w-6" />,
    title: 'Conference Registration',
    description: 'UX/UI Design Conference 2024',
    category: 'Marketing',
    amount: '€299.00',
    date: '10/11/2024',
    status: 'Approved',
    statusColor: 'bg-green-100 text-green-600',
    project: 'Brand Campaign',
  },
];

const ExpenseTable: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-3">EXPENSE</th>
            <th className="p-3">CATEGORY</th>
            <th className="p-3">AMOUNT</th>
            <th className="p-3">DATE</th>
            <th className="p-3">STATUS</th>
            <th className="p-3">PROJECT</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index} className="border-t border-gray-200">
              <td className="p-3 flex items-center">
                <div className="bg-gray-100 p-2 rounded mr-3">{expense.icon}</div>
                <div>
                  <div className="font-semibold">{expense.title}</div>
                  <div className="text-gray-500 text-xs">{expense.description}</div>
                </div>
              </td>
              <td className="p-3">{expense.category}</td>
              <td className="p-3">{expense.amount}</td>
              <td className="p-3">{expense.date}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs ${expense.statusColor}`}>
                  {expense.status}
                </span>
              </td>
              <td className="p-3">{expense.project}</td>
              <td className="p-3">
                <EyeIcon className="h-4 w-4 text-blue-500" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;