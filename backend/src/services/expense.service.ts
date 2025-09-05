import Expense from '../models/expense.model';

class ExpenseService {
  // ➕ Create expense
  async createExpense(data: {
    amount: number;
    date?: string;
    description?: string;
    type?: 'OneTime' | 'Recurring';
    receipt?: string;
    startDate?: string;
    endDate?: string;
    userId: number;
    categoryId: number;
    }) {
    return await Expense.create({
        ...data,
        type: data.type ?? 'OneTime', // 👈 défaut si non fourni
    });
  }

  // 📖 Get all expenses of a user (with optional filters)
  async getExpenses(userId: number, filters: any = {}) {
    const where: any = { userId };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }
    if (filters.type) {
      where.type = filters.type;
    }
    if (filters.startDate && filters.endDate) {
      where.date = {
        $between: [filters.startDate, filters.endDate],
      };
    }

    return await Expense.findAll({ where });
  }

  // 📖 Get single expense by id (must belong to the user)
  async getExpenseById(id: number, userId: number) {
    return await Expense.findOne({ where: { id, userId } });
  }

  // ✏️ Update expense (only if belongs to user)
  async updateExpense(
    id: number,
    userId: number,
    updates: Partial<{
      amount: number;
      date?: string;
      description?: string;
      type?: 'OneTime' | 'Recurring';
      receipt?: string;
      startDate?: string;
      endDate?: string;
      categoryId: number;
    }>
  ) {
    const expense = await Expense.findOne({ where: { id, userId } });
    if (!expense) {
      throw new Error('Expense not found or not authorized');
    }
    return await expense.update(updates);
  }

  // 🗑️ Delete expense (only if belongs to user)
  async deleteExpense(id: number, userId: number) {
    const expense = await Expense.findOne({ where: { id, userId } });
    if (!expense) {
      throw new Error('Expense not found or not authorized');
    }
    await expense.destroy();
    return { message: 'Expense deleted successfully' };
  }
}

export default new ExpenseService();
