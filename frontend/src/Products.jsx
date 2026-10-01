import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faMagnifyingGlass, faCartPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "./context/CartContext";
import { api } from "./services/api";
import { getProductImage } from "./utils/imageMapper";
import "./Products.css";

const STATIC_ITEMS = [
  { id: 1, name: "Vanilla Cake", price: "₹500", category: "cake", tag: "Popular", description: "Classic soft & fluffy vanilla sponge layered with silky vanilla buttercream and sweet colorful sprinkles." },
  { id: 2, name: "Rasamalai Cake", price: "₹600", category: "cake", tag: "Bestseller", description: "Authentic Indian fusion cake infused with cardamom sponge, saffron syrup, pistachio crunch, and real juicy rasamalai toppings." },
  { id: 3, name: "Chocolate Cake", price: "₹600", category: "cake", tag: "Popular", description: "Rich, moist chocolate sponge coated with dark chocolate frosting and topped with glossy cherries." },
  { id: 4, name: "Red Velvet Cake", price: "₹550", category: "cake", tag: "Trending", description: "Decadent crimson cocoa cake layered with smooth, whipped cream cheese frosting and fine red velvet crumbs." },
  { id: 5, name: "Tender Coconut Cake", price: "₹650", category: "cake", tag: null, description: "Light tropical cake made with real coconut milk, tender coconut flesh, and fluffy light cream filling." },
  { id: 6, name: "Black Forest Cake", price: "₹550", category: "cake", tag: null, description: "Traditional German chocolate sponge layered with fresh whipped cream, sweet cherry compote, and dark chocolate shavings." },
  { id: 7, name: "White Forest Cake", price: "₹550", category: "cake", tag: null, description: "Delicate vanilla sponge filled with juicy cherries, white chocolate curls, and light whipped cream." },
  { id: 8, name: "Choco Truffle Cake", price: "₹600", category: "cake", tag: "Popular", description: "Ultimate indulgence featuring dense chocolate cake layered with rich, melted dark chocolate ganache truffle." },
  { id: 9, name: "Honey Cake", price: "₹550", category: "cake", tag: null, description: "Classic bakery favorite soaked in pure honey syrup, layered with mixed fruit jam, and coated in fresh coconut flakes." },
  { id: 10, name: "Butterscotch Cake", price: "₹500", category: "cake", tag: null, description: "Soft butterscotch sponge layered with smooth caramel cream and crunchy golden praline bits." },
  { id: 11, name: "Rosemilk Cake", price: "₹550", category: "cake", tag: null, description: "Fragrant South Indian specialty sponge soaked in aromatic rose milk and topped with rose petal cream." },
  { id: 12, name: "Blueberry Cake", price: "₹550", category: "cake", tag: null, description: "Delicious vanilla cake layered with real blueberry compote and light fruit-infused frosting." },
  { id: 13, name: "Fudge Brownie", price: "₹600", category: "brownie", tag: "Bestseller", description: "Fudgy, dense, melted chocolate brownie with a crispy top crust and gooey chocolate center." },
  { id: 14, name: "Nuts Brownie", price: "₹700", category: "brownie", tag: null, description: "Gooey chocolate brownie packed with crunchy roasted walnuts, almonds, and cashew nuts." },
  { id: 15, name: "Triple Chocolate Brownie", price: "₹700", category: "brownie", tag: "Popular", description: "Decadent chocolate brownie baked with dark, milk, and white chocolate chunks for total chocolate delight." }
];

const TAG_COLORS = {
  Popular:    "linear-gradient(135deg,#f43f8e,#c73076)",
  Bestseller: "linear-gradient(135deg,#a855f7,#7c3aed)",
  Trending:   "linear-gradient(135deg,#f97316,#ef4444)",
};

function Products() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [activeItem, setActiveItem] = useState(null);
  const [items, setItems] = useState(STATIC_ITEMS);
  const [addedId, setAddedId] = useState(null);
  const { addToCart } = useCart();

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
    setTimeout(() => setAddedId(null), 1800);
  };

  const visible = useMemo(() => {
    return items.filter((item) => {
      const matchCat =
        filter === "all"      ? true :
        filter === "cakes"    ? item.category?.toLowerCase() === "cake" :
        filter === "brownies" ? item.category?.toLowerCase() === "brownie" : true;
      const matchSearch = item.name?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [filter, search, items]);

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
