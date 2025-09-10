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

  // Charger les catégories depuis l’API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get<Category[]>('/categories'); // <-- appelle ton backend
        setCategories(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle Add category
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");


  const handleAddCategory = async () => {
    try {
        const res = await api.post<Category>("/categories", {
        name: newName,
        description: newDescription,
        });

        // Ajouter la nouvelle catégorie à la liste existante
        setCategories((prev) => [...prev, res.data]);

        // Réinitialiser les champs
        setNewName("");
        setNewDescription("");

        // Fermer la modal
        setShowAddCategory(false);
    } catch (error) {
        console.error("Erreur lors de la création de la catégorie :", error);
    }
 };

     // Handle Edit and Delete Buttons
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

    const handleDeleteClick = (id: number) => {
        setDeletingId(id);
    };

    const handleCancelDelete = () => {
        setDeletingId(null);
    };

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
        </div>
        <button
          onClick={() => setShowAddCategory(true)}
          className="px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:brightness-90 transition"
        >
          + New Category
        </button>
      </div>

      {/* List Categories */}
      <div className="bg-[var(--color-bg-card)] rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-bg)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-sub)] uppercase">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
  {categories.map((category) => (
    <tr key={category.id}>
      <td className="px-6 py-4">
        {editingId === category.id ? (
          <input
            name="name"
            value={editForm.name ?? ""}
            onChange={handleEditChange}
            className="w-full p-2 border rounded"
          />
        ) : (
          category.name
        )}
      </td>
      <td className="px-6 py-4">
        {editingId === category.id ? (
          <input
            name="description"
            value={editForm.description ?? ""}
            onChange={handleEditChange}
            className="w-full p-2 border rounded"
          />
        ) : (
          category.description
        )}
      </td>
      <td className="px-6 py-4">
        {editingId === category.id ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleSaveEdit(category.id)}
              disabled={isSaving}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        ) : deletingId === category.id ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleConfirmDelete(category.id)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Confirm
            </button>
            <button
              onClick={handleCancelDelete}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => handleEditClick(category)}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteClick(category.id)}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Delete
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

      {/* Modal to add category */}
        {showAddCategory && (
            <div className="fixed inset-0 bg-transparent flou flo bg-opacity-20 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-4">Add category</h2>
                <div>
                    <label className="block text-sm text-[var(--color-text-sub)] mb-1">Name</label>
                    <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Ex: Abonnements"
                    />
                </div>
                <div>
                    <label className="block text-sm text-[var(--color-text-sub)] mb-1">Description</label>
                    <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Ex: Catégories récurrentes"
                    />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button
                    onClick={() => setShowAddCategory(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                    >
                    Annuler
                    </button>
                    <button
                    onClick={handleAddCategory}
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

export default CategoryContent;
