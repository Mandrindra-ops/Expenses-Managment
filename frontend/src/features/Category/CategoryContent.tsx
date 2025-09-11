import { Edit2, Trash2 , Check, X} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import api from '../../utils/api'; // <-- ton fichier axios

interface Category {
  id: number;
  name: string;
  description: string;
}

const CategoryContent: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get<Category[]>('/categories');
        setCategories(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Ajout catégorie
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleAddCategory = async () => {
    try {
      const res = await api.post<Category>("/categories", {
        name: newName,
        description: newDescription,
      });

      setCategories((prev) => [...prev, res.data]);
      setNewName("");
      setNewDescription("");
      setShowAddCategory(false);
    } catch (error) {
      console.error("Erreur lors de la création de la catégorie :", error);
    }
  };

  // Édition / suppression
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ name?: string; description?: string }>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = (category: Category) => {
    setEditingId(category.id);
    setEditForm({ name: category.name, description: category.description });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (id: number) => {
    if (!editingId) return;

    const name = (editForm.name ?? "").trim();
    const description = editForm.description?.trim();

    if (!name) {
      alert("Name is required");
      return;
    }

    try {
      setIsSaving(true);
      const res = await api.put<Category>(`/categories/${id}`, { name, description });
      setCategories((prev) => prev.map((c) => (c.id === id ? res.data : c)));
      handleCancelEdit();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (id: number) => setDeletingId(id);
  const handleCancelDelete = () => setDeletingId(null);

  const handleConfirmDelete = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setDeletingId(null);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[var(--color-bg)]">
      {/* Head */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">My categories</h1>
          <p className="text-[var(--color-text-sub)]">Keep track of all the expense categories</p>
        </div>
        <button
          onClick={() => setShowAddCategory(true)}
          className="mt-4 md:mt-0 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition"
        >
          + New Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow overflow-hidden border border-[var(--color-secondary-light)]/20">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-[var(--color-bg)] border-b border-[var(--color-secondary-light)]/30">
              <tr>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-sub)] uppercase">
                  Name
                </th>
                <th className="w-2/4 px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-sub)] uppercase">
                  Description
                </th>
                <th className="w-1/4 px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-sub)] uppercase">
                  Settings
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-secondary-light)]/20">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-[var(--color-secondary-light)]/5 transition">
                  <td className="px-6 py-4">
                    {editingId === category.id ? (
                      <input
                        name="name"
                        value={editForm.name ?? ""}
                        onChange={handleEditChange}
                        className="w-full py-2 px-3 border border-[var(--color-secondary-light)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
                      />
                    ) : (
                      <span className="text-[var(--color-text)]">{category.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === category.id ? (
                      <input
                        name="description"
                        value={editForm.description ?? ""}
                        onChange={handleEditChange}
                        className="w-full py-2 px-3 border border-[var(--color-secondary-light)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
                      />
                    ) : (
                      <span className="text-[var(--color-text-sub)]">{category.description}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === category.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(category.id)}
                          disabled={isSaving}
                          className="px-2 py-1 bg-[var(--color-primary)] text-sm text-white rounded-lg hover:opacity-90"
                        >
                          {isSaving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          className="px-2 py-1 bg-red-600 text-white text-sm rounded-lg hover:opacity-90"
                        >
                          <X className="w-4 h-4"/>
                        </button>
                      </div>
                    ) : deletingId === category.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConfirmDelete(category.id)}
                          className="px-2 py-1 bg-[var(--color-expense)] text-sm text-white rounded-lg hover:opacity-90"
                        >
                          <Check className="w-4 h-4"/>
                        </button>
                        <button
                          onClick={handleCancelDelete}
                          className="px-2 py-1 bg-gray-300  text-sm rounded-lg hover:opacity-90"
                        >
                          <X className="w-4 h-4"/>
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(category)}
                          className="p-1 bg-[var(--color-primary)] text-white rounded text-sm hover:opacity-90"
                        >
                          <Edit2 className="w-4 h-4"/>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category.id)}
                          className="p-1 bg-[var(--color-expense)] text-white rounded text-sm hover:opacity-90"
                        >
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 flou flex items-center justify-center z-50">
          <div className="bg-[var(--color-bg-card)] rounded-xl shadow-lg p-6 w-full max-w-md border border-[var(--color-secondary-light)]/30">
            <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Add category</h2>
            <div className="mb-4">
              <label className="block text-sm text-[var(--color-text-sub)] mb-1">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2 border border-[var(--color-secondary-light)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
                placeholder="Ex: Abonnements"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-sub)] mb-1">Description</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full p-2 border border-[var(--color-secondary-light)] rounded-lg bg-[var(--color-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
                placeholder="Ex: Catégories récurrentes"
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddCategory(false)}
                className="px-4 py-2 bg-[var(--color-alert)] text-white rounded-lg hover:opacity-90"
              >
                <X className="w-4 h-4"/>
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90"
              >
                <Check className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryContent;
