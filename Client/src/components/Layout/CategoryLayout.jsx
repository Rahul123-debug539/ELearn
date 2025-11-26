import "./CategoryLayout.css";

function CategoryLayout({ sidebar, content }) {
  return (
    <div className="cat-layout">
      <aside className="cat-sidebar">{sidebar}</aside>
      <main className="cat-content">{content}</main>
    </div>
  );
}

export default CategoryLayout;
