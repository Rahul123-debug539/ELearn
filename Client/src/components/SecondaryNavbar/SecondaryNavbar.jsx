import { useEffect, useState } from "react";
import "./SecondaryNavbar.css";
import api from "../../api/api";
import { useNavigate, useLocation } from "react-router-dom";

function SecondaryNavbar() {
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(null); // slug
  const navigate = useNavigate();
  const location = useLocation();

  /* -------------------------------
      LOAD CATEGORIES
  ------------------------------- */
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get("/api/categories");
        if (res.data.status) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCats();
  }, []);

  /* -------------------------------
      SET ACTIVE CATEGORY FROM URL
  ------------------------------- */
  useEffect(() => {
    const parts = location.pathname.split("/");
    if (parts[1]) {
      setActiveCat(parts[1]); // categorySlug
    } else {
      setActiveCat(null);
    }
  }, [location.pathname]);

  /* -------------------------------
      HANDLE CATEGORY CLICK
  ------------------------------- */
  const handleClick = (cat) => {
    setActiveCat(cat.slug);
    navigate(`/${cat.slug}`);
  };

  return (
    <div className="subnav">
      <ul className="subnav-list">
        {categories.map((cat) => (
          <li
            key={cat._id}
            className={activeCat === cat.slug ? "active" : ""}
            onClick={() => handleClick(cat)}
          >
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SecondaryNavbar;
