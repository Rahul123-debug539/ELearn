import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

function ManageCategories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      if (res.data.status) setCategories(res.data.categories);
    } catch (err) {
      toast.error("Error loading categories");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/categories/add", { name });
      if (res.data.status) {
        toast.success("Category added");
        setName("");
        loadCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding category");
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.data.status) {
        toast.success("Category deleted");
        loadCategories();
      }
    } catch {
      toast.error("Error deleting category");
    }
  };

  return (
    <div className="admin-page">
      <h2>Manage Categories</h2>

      <form onSubmit={addCategory} className="admin-form">
        <input
          type="text"
          placeholder="Category name (e.g., Java)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Add Category</button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.slug}</td>
              <td>
                <button className="delete-btn" onClick={() => deleteCategory(c._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageCategories;
