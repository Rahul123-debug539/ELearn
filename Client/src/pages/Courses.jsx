import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function Courses() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      if (res.data.status) setCategories(res.data.categories);
    } catch (err) {
      console.log("Category load error:", err);
    }
  };

  return (
    <div style={{
      padding: "3rem",
      background: "#020617",
      minHeight: "calc(100vh - 120px)",
      color: "#e5e7eb"
    }}>

      <h1 style={{ color: "#38bdf8", marginBottom: "1.5rem" }}>
        Available Courses
      </h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1.5rem"
      }}>
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/category/${cat._id}`}
            style={{
              background: "#0f172a",
              padding: "1.2rem",
              borderRadius: "0.8rem",
              border: "1px solid #1f2937",
              textDecoration: "none",
              color: "#38bdf8",
              transition: "0.2s ease",
            }}
          >
            <h3>{cat.name}</h3>
            <p style={{ opacity: 0.8, marginTop: "0.3rem" }}>
              Explore topics & subtopics
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Courses;
