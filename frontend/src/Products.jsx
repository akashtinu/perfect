import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faMagnifyingGlass, faCartPlus, faCheck, faSort, faStar } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "./context/CartContext";
import { useToast } from "./components/Toast";
import { api } from "./services/api";
import { getProductImage } from "./utils/imageMapper";
import "./Products.css";

const STATIC_ITEMS = [
  { id: 1, name: "Vanilla Cake", price: "₹500", category: "cake", tag: "Popular", rating: 4.8, reviews: 42, description: "Classic soft & fluffy vanilla sponge layered with silky vanilla buttercream and sweet colorful sprinkles." },
  { id: 2, name: "Rasamalai Cake", price: "₹600", category: "cake", tag: "Bestseller", rating: 4.9, reviews: 118, description: "Authentic Indian fusion cake infused with cardamom sponge, saffron syrup, pistachio crunch, and real juicy rasamalai toppings." },
  { id: 3, name: "Chocolate Cake", price: "₹600", category: "cake", tag: "Popular", rating: 4.7, reviews: 85, description: "Rich, moist chocolate sponge coated with dark chocolate frosting and topped with glossy cherries." },
  { id: 4, name: "Red Velvet Cake", price: "₹550", category: "cake", tag: "Trending", rating: 4.9, reviews: 64, description: "Decadent crimson cocoa cake layered with smooth, whipped cream cheese frosting and fine red velvet crumbs." },
  { id: 5, name: "Tender Coconut Cake", price: "₹650", category: "cake", tag: null, rating: 4.6, reviews: 29, description: "Light tropical cake made with real coconut milk, tender coconut flesh, and fluffy light cream filling." },
  { id: 6, name: "Black Forest Cake", price: "₹550", category: "cake", tag: null, rating: 4.8, reviews: 94, description: "Traditional German chocolate sponge layered with fresh whipped cream, sweet cherry compote, and dark chocolate shavings." },
  { id: 7, name: "White Forest Cake", price: "₹550", category: "cake", tag: null, rating: 4.7, reviews: 38, description: "Delicate vanilla sponge filled with juicy cherries, white chocolate curls, and light whipped cream." },
  { id: 8, name: "Choco Truffle Cake", price: "₹600", category: "cake", tag: "Popular", rating: 5.0, reviews: 152, description: "Ultimate indulgence featuring dense chocolate cake layered with rich, melted dark chocolate ganache truffle." },
  { id: 9, name: "Honey Cake", price: "₹550", category: "cake", tag: null, rating: 4.5, reviews: 22, description: "Classic bakery favorite soaked in pure honey syrup, layered with mixed fruit jam, and coated in fresh coconut flakes." },
  { id: 10, name: "Butterscotch Cake", price: "₹500", category: "cake", tag: null, rating: 4.6, reviews: 49, description: "Soft butterscotch sponge layered with smooth caramel cream and crunchy golden praline bits." },
  { id: 11, name: "Rosemilk Cake", price: "₹550", category: "cake", tag: null, rating: 4.8, reviews: 71, description: "Fragrant South Indian specialty sponge soaked in aromatic rose milk and topped with rose petal cream." },
  { id: 12, name: "Blueberry Cake", price: "₹550", category: "cake", tag: null, rating: 4.7, reviews: 33, description: "Delicious vanilla cake layered with real blueberry compote and light fruit-infused frosting." },
  { id: 13, name: "Fudge Brownie", price: "₹600", category: "brownie", tag: "Bestseller", rating: 4.9, reviews: 103, description: "Fudgy, dense, melted chocolate brownie with a crispy top crust and gooey chocolate center." },
  { id: 14, name: "Nuts Brownie", price: "₹700", category: "brownie", tag: null, rating: 4.8, reviews: 56, description: "Gooey chocolate brownie packed with crunchy roasted walnuts, almonds, and cashew nuts." },
  { id: 15, name: "Triple Chocolate Brownie", price: "₹700", category: "brownie", tag: "Popular", rating: 4.9, reviews: 88, description: "Decadent chocolate brownie baked with dark, milk, and white chocolate chunks for total chocolate delight." }
];

const TAG_COLORS = {
  Popular:    "linear-gradient(135deg,#f43f8e,#c73076)",
  Bestseller: "linear-gradient(135deg,#a855f7,#7c3aed)",
  Trending:   "linear-gradient(135deg,#f97316,#ef4444)",
};

function Products() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [activeItem, setActiveItem] = useState(null);
  const [items, setItems] = useState(STATIC_ITEMS);
  const [addedId, setAddedId] = useState(null);
  const { addToCart } = useCart();
  const toast = useToast();

  useEffect(() => {
    api.getProducts().then((data) => {
      if (data && data.length > 0) {
        setItems(data);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setActiveItem(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    addToCart(item);
    setAddedId(item.id);
    toast(`🛒 "${item.name}" added to cart!`, "success");
    setTimeout(() => setAddedId(null), 1800);
  };

  const getNumericPrice = (item) => {
    if (typeof item.price === "number") return item.price;
    return parseFloat(String(item.price).replace(/[^\d.]/g, "")) || 0;
  };

  const visible = useMemo(() => {
    let result = items.filter((item) => {
      const matchCat =
        filter === "all"      ? true :
        filter === "cakes"    ? item.category?.toLowerCase() === "cake" :
        filter === "brownies" ? item.category?.toLowerCase() === "brownie" : true;
      const matchSearch = item.name?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
    if (sort === "low-high")  result = [...result].sort((a, b) => getNumericPrice(a) - getNumericPrice(b));
    if (sort === "high-low")  result = [...result].sort((a, b) => getNumericPrice(b) - getNumericPrice(a));
    if (sort === "name-az")   result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [filter, search, sort, items]);

  return (
    <section className="products" id="cakes">
      {/* Header */}
      <div className="products-header">
        <h2 className="products-title">Our Delicious Creations</h2>
        <p className="products-subtitle">
          Explore our handcrafted range of designer cakes and rich chocolate brownies
        </p>
      </div>

      {/* Controls */}
      <div className="products-controls">
        <div className="filter-tabs">
          {["all", "cakes", "brownies"].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "cakes" ? "🎂 " : f === "brownies" ? "🍫 " : ""}
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {/* Sort Dropdown */}
          <div style={{ position: "relative" }}>
            <FontAwesomeIcon icon={faSort} style={{
              position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
              color: "#94a3b8", pointerEvents: "none",
            }} />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                paddingLeft: 30, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                borderRadius: 30, border: "1.5px solid #e2e8f0",
                fontSize: "0.88rem", fontWeight: 600, color: "#475569",
                background: "#fff", cursor: "pointer", outline: "none",
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              }}
            >
              <option value="default">Sort: Default</option>
              <option value="low-high">Price: Low → High</option>
              <option value="high-low">Price: High → Low</option>
              <option value="name-az">Name: A → Z</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="search-box">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            <input
              type="text"
              placeholder="Search cake flavor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="cake-grid" id="brownies">
        {visible.length > 0 ? visible.map((item) => {
          const cakeImage = getProductImage(item);
          return (
            <div className="cake-card active" key={item.id}>
              {item.tag && (
                <span
                  className="badge"
                  style={{ background: TAG_COLORS[item.tag] || TAG_COLORS.Popular }}
                >
                  {item.tag}
                </span>
              )}

              <div className="card-img-wrap" onClick={() => setActiveItem(item)}>
                <img src={cakeImage} alt={item.name} />
                <div className="img-overlay">
                  <span className="click-to-view">Click Details</span>
                </div>
              </div>

              <div className="card-body">
                <h3>{item.name}</h3>
                
                {/* Rating Badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <div style={{ color: "#f59e0b", fontSize: "0.85rem" }}>
                    <FontAwesomeIcon icon={faStar} />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#1e293b" }}>
                    {item.rating || 4.8}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                    ({item.reviews || 25} reviews)
                  </span>
                </div>

                <p className="price">
                  {typeof item.price === "number" ? `₹${item.price}` : item.price}
                </p>
                
                <div className="d-flex gap-2 w-100">
                  <button
                    className={`btn w-100 py-2 fw-bold text-white ${addedId === item.id ? "btn-success" : "btn-pink-primary"}`}
                    onClick={(e) => handleAddToCart(e, item)}
                  >
                    <FontAwesomeIcon icon={addedId === item.id ? faCheck : faCartPlus} className="me-1" />
                    {addedId === item.id ? "Added!" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          );
        }) : (
          <p className="no-results">No items match your search 🙁</p>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="modal-backdrop" onClick={() => setActiveItem(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-img-wrap">
              <img src={getProductImage(activeItem)} alt={activeItem.name} />
              <button
                className="modal-close-btn"
                onClick={() => setActiveItem(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <h3 className="modal-title">{activeItem.name}</h3>
              <p className="modal-price">
                {typeof activeItem.price === "number" ? `₹${activeItem.price}` : activeItem.price}
              </p>
              <p className="modal-desc">{activeItem.description}</p>
              
              <button
                className="btn btn-pink-primary w-100 py-2.5 mb-2 fw-bold"
                onClick={(e) => {
                  handleAddToCart(e, activeItem);
                  setActiveItem(null);
                }}
              >
                <FontAwesomeIcon icon={faCartPlus} className="me-2" /> Add to Shopping Cart
              </button>

              <a
                href="https://www.instagram.com/jbnca_kes/"
                target="_blank"
                rel="noreferrer"
                className="modal-order-btn"
              >
                <FontAwesomeIcon icon={faInstagram} /> Order via Instagram DM
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Products;
