import { useEffect, useState } from "react";
import "./SecondaryNavbar.css";
import api from "../../api/api";
import { useNavigate, useLocation } from "react-router-dom";

function SecondaryNavbar() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCat, setActiveCat] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get("/categories");
        if (res.data.status) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const parts = location.pathname.split("/");
    if (parts[1] === "category" && parts[2]) {
      setActiveCat(parts[2]);
    } else {
      setActiveCat(null);
    }
  }, [location]);

  const handleClick = (cat) => {
    setActiveCat(cat._id);
    navigate(`/category/${cat._id}`);
  };

  return (
    <div className="subnav">
      <ul className="subnav-list">
        {categories.map((cat) => (
          <li
            key={cat._id}
            className={activeCat === cat._id ? "active" : ""}
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
