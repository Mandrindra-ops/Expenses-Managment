export const seedDefaultCategories = async (Category) => {
  const defaults = ["Food", "Rent", "Electricity", "Transport", "Health"];

  for (const name of defaults) {
    await Category.findOrCreate({
      where: { name },
      defaults: {
        isDefault: true,
        description: `${name} expenses`,
      },
    });
  }
};
