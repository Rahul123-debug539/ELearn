import { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import "./AdminDashboard.css";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      if (data.status) setCategories(data.categories);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  // Add or Update category
  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Category name is required");

    try {
      if (editing) {
        const { data } = await api.put(`/categories/${editing}`, { name });
        if (data.status) toast.success("Category updated");
      }else {
        const { data } = await api.post("/categories/add", { name });

        if (data.status) toast.success("Category added");
      }

      setName("");
      setEditing(null);
      loadCategories();
    } catch {
      toast.error("Action failed");
    }
  };

  const handleEdit = (cat) => {
    setName(cat.name);
    setEditing(cat._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      const { data } = await api.delete(`/categories/${id}`);
      if (data.status) {
        toast.success("Category deleted");
        loadCategories();
      }
    } catch {
      toast.error("Deletion failed");
    }
  };

  return (
    <div className="admin-page">
      <h2>Manage Categories</h2>

      {/* Input box */}
      <div className="form-box">
        <input
          type="text"
          placeholder="Enter Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="admin-btn" onClick={handleSubmit}>
          {editing ? "Update Category" : "Add Category"}
        </button>
      </div>

      {/* Category List */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat, i) => (
            <tr key={cat._id}>
              <td>{i + 1}</td>
              <td>{cat.name}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(cat)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(cat._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {categories.length === 0 && (
            <tr>
              <td colSpan="3" className="empty-msg">
                No categories found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ManageCategories;
