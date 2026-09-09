import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { supabase } from "../lib/supabase";

import gsap from "gsap";
import "../App.css";
import "./Dashboard.css";

// Tea variants/categories
const teaCategories = ["Black", "Ginger", "Cardamom", "Peppermint", "Hibiscus", "Lemon Balm", "Cinnamon", "Rosemary", "Chamomile", "Herbal", "Oolong", "White Tea"];

export default function Dashboard() {
  const { cart, setCart } = useOutletContext();

  const [darkMode, setDarkMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [activeCategory, setActiveCategory] = useState("Chamomile");
  const [pullStart, setPullStart] = useState(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [selectedFlavour, setSelectedFlavour] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();
  const unitPrice = Number(selectedWeight?.price || 0);

  useEffect(() => {
    async function loadProducts() {
      console.log("🔄 Starting to load products from Supabase");
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true)
        .order("id", { ascending: false });

      console.log("📥 Supabase response:", { data, error });
      console.log("📊 Data length:", data?.length);
      console.log("🔍 Sample data structure:", data?.[0]);

      if (error || !data?.length) {
        console.log("⚠️ Using fallback products due to error or no data");
        setProducts([
          {
            id: 1,
            name: "Tealuxe Black Tea",
            category: "Black",
            variations: [
              {
                id: 101,
                flavour: "Black Tea",
                image_url: "/assets/blackTea.png",
                weights: [{ id: 201, weight: "100g", price: 250 }],
              },
            ],
          },
          {
            id: 2,
            name: "Tealuxe Ginger Tea",
            category: "Ginger",
            variations: [
              {
                id: 102,
                flavour: "Ginger",
                image_url: "/assets/gingerTea.png",
                weights: [{ id: 202, weight: "100g", price: 600 }],
              },
            ],
          },
          {
            id: 3,
            name: "Chamomile",
            category: "Herbal",
            variations: [
              {
                id: 103,
                flavour: "Chamomile",
                image_url: "/assets/chamomile.png",
                weights: [{ id: 203, weight: "50g", price: 400 }],
              },
            ],
          },
          {
            id: 4,
            name: "Tie Guan Yin",
            category: "Oolong",
            variations: [
              {
                id: 104,
                flavour: "Tie Guan Yin",
                image_url: "/assets/oolong.png",
                weights: [{ id: 204, weight: "100g", price: 700 }],
              },
            ],
          },
          {
            id: 5,
            name: "Silver Needle",
            category: "White Tea",
            variations: [
              {
                id: 105,
                flavour: "Silver Needle",
                image_url: "/assets/silverneedle.png",
                weights: [{ id: 205, weight: "50g", price: 900 }],
              },
            ],
          },
        ]);
        return;
      }

      // Map database structure to frontend expected structure
      const normalized = (data || []).map((p, index) => {
        // Derive category from image_url or caffeine_level
        let category = "Herbal";
        const imageUrl = p.image_url || "";
        
        console.log(`🔧 Processing product ${index}:`, { name: p.name, imageUrl, caffeine: p.caffeine_level });
        
        if (imageUrl.toLowerCase().includes("ginger")) category = "Ginger";
        else if (imageUrl.toLowerCase().includes("hibiscus")) category = "Hibiscus";
        else if (imageUrl.toLowerCase().includes("cinnamon")) category = "Cinnamon";
        else if (imageUrl.toLowerCase().includes("cardamom")) category = "Cardamom";
        else if (imageUrl.toLowerCase().includes("lemon")) category = "Lemon Balm";
        else if (imageUrl.toLowerCase().includes("peppermint")) category = "Peppermint";
        else if (imageUrl.toLowerCase().includes("rosemary")) category = "Rosemary";
        else if (imageUrl.toLowerCase().includes("chamomile")) category = "Chamomile";
        else if (p.caffeine_level === "Medium") category = "Black";
        else if (p.name.toLowerCase().includes("black")) category = "Black";
        
        console.log(`✅ Assigned category: "${category}"`);
        
        // Fallback image if image_url is empty or starts with /uploads/
        const fallbackImage = "/assets/default-product.jpg";
        const safeImageUrl = (imageUrl && !imageUrl.startsWith("/uploads/")) ? imageUrl : fallbackImage;

        return {
          id: p.id || index + 1,
          name: category + " Tea",
          category: category, // Keep capitalized category for proper matching
          base_price: Number(p.base_price) || 250,
          stock: p.stock || 100,
          caffeine_level: p.caffeine_level,
          health_benefits: p.health_benefits,
          variations: [
            {
              id: index * 100 + 1,
              flavour: category,
              image_url: safeImageUrl,
              weights: [
                {
                  id: index * 200 + 1,
                  weight: "100g",
                  price: Number(p.base_price) || 250
                }
              ]
            }
          ]
        };
      });

      console.log("✅ Normalized products:", normalized);
      console.log("🏷️ Product categories:", normalized.map(p => ({ id: p.id, name: p.name, category: p.category, hasVariations: p.variations?.length > 0 })));
      setProducts(normalized);
    }

    loadProducts();
  }, []);

  useEffect(() => {
    const refreshLayout = () => window.dispatchEvent(new Event("resize"));
    const timer = setTimeout(refreshLayout, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (selectedProduct) e.preventDefault();
    };
    document.body.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    return () =>
      document.body.removeEventListener("touchmove", handleTouchMove);
  }, [selectedProduct]);

  useEffect(() => {
    gsap.from(".hero", { y: -50, opacity: 0, duration: 0.8 });
    window.addEventListener("load", () => {
      gsap.from(".product-card", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
      });
    });
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      document.body.classList.add("modal-open");
      gsap.fromTo(
        ".product-modal",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(
        ".modal-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [selectedProduct]);

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) setPullStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (pullStart !== null) {
      const distance = e.touches[0].clientY - pullStart;
      if (distance > 0) setPullDistance(distance);
    }
  };

  const filteredProducts = products
    .filter((p) => p.variations?.length > 0)
    .filter((p) => {
      // More flexible category matching
      const productCategory = p.category?.toLowerCase() || "";
      const activeCat = activeCategory?.toLowerCase() || "";
      const matches = productCategory === activeCat || productCategory.includes(activeCat) || activeCat.includes(productCategory);
      console.log(`🔍 Filtering: "${p.name}" (category: "${productCategory}") vs active: "${activeCat}" -> ${matches}`);
      return matches;
    })
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  console.log("📋 Filtering summary:");
  console.log(`  Active category: "${activeCategory}"`);
  console.log(`  Search term: "${searchTerm}"`);
  console.log(`  Total products: ${products.length}`);
  console.log(`  Filtered products: ${filteredProducts.length}`);

  const openProductPopup = (product) => {
    setSelectedProduct(product);
    const firstVar = product.variations?.[0];
    const firstWeight = firstVar?.weights?.[0];
    setSelectedFlavour(firstVar || null);
    setSelectedWeight(firstWeight || null);
    setQuantity(1);
    setNotes("");
  };

  const confirmAddToCart = () => {
    if (!selectedFlavour || !selectedWeight) {
      alert("Please select product options");
      return;
    }

    setCart((prev) => [
      ...prev,
      {
        productId: selectedProduct.id,
        variationId: selectedFlavour.id,
        weightId: selectedWeight.id,
        name: selectedProduct.name,
        flavour: selectedFlavour.flavour,
        weight: selectedWeight.weight,
        unitPrice,
        quantity,
        total: unitPrice * quantity,
        notes,
      },
    ]);

    setSelectedProduct(null);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute(
      "data-theme",
      !darkMode ? "dark" : "light"
    );
  };

  return (
    <div
      className="dashboard-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <section className="hero">
        <h1>A World of <span className="accent">Tea,</span><br/> — A Sip of Luxury</h1>
      </section>

      {pullDistance > 0 && (
        <div className="pull-refresh-indicator">↓ Pull to refresh</div>
      )}

      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search products..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <section className="categories">
        <div className="categories-scroll">
          {teaCategories.map((c, i) => (
            <button
              key={i}
              className={`category-btn ${activeCategory === c ? "active" : ""}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="panel products">
        <h2>Order Now</h2>
        
        {/* Deal of the Week */}
        {filteredProducts.length > 0 && (
          <div className="deal-of-week">
            <div className="deal-badge">🔥 Deal of the Week</div>
            {(() => {
              const dealProduct = filteredProducts[0];
              const firstVar = dealProduct.variations?.[0];
              const firstWeight = firstVar?.weights?.[0];
              const previewImage = firstVar?.image_url || "/assets/default-product.jpg";
              const previewPrice = firstWeight?.price || 0;
              
              return (
                <div className="deal-card">
                  <img 
                    src={previewImage} 
                    alt={dealProduct.name} 
                    className="deal-image"
                    onError={(e) => {
                      e.target.src = "/assets/default-product.jpg";
                    }}
                  />
                  <div className="deal-info">
                    <h3 className="deal-name">{dealProduct.name}</h3>
                    <span className="deal-price">
                      KES {Number(previewPrice).toLocaleString()}
                    </span>
                    <button
                      className="deal-order-btn"
                      onClick={() => {
                        if (!dealProduct.variations?.length) {
                          alert("Product not configured yet");
                          return;
                        }
                        openProductPopup(dealProduct);
                      }}
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Regular Products - Show 3 */}
        <div className="regular-products">
          <h3>More Products</h3>
          <div className="product-grid">
            {filteredProducts.slice(1, 4).map((p) => {
              const firstVar = p.variations?.[0];
              const firstWeight = firstVar?.weights?.[0];
              const previewImage = firstVar?.image_url || "/assets/default-product.jpg";
              const previewPrice = firstWeight?.price || 0;

              return (
                <div key={p.id} className="product-card">
                  <img 
                    src={previewImage} 
                    alt={p.name} 
                    onError={(e) => {
                      e.target.src = "/assets/default-product.jpg";
                    }}
                  />
                  <span className="product-name">{p.name}</span>
                  <span className="product-price">
                    From KES {Number(previewPrice).toLocaleString()}
                  </span>

                  <button
                    className="add-cart"
                    onClick={() => {
                      if (!p.variations?.length) {
                        alert("Product not configured yet");
                        return;
                      }
                      openProductPopup(p);
                    }}
                  >
                    Order
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <button className="theme-switch" onClick={toggleTheme}>
        {darkMode ? "☀️" : "🌙"}
      </button>

      {selectedProduct && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="product-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedFlavour?.image_url || "/assets/teabg.png"}
              alt=""
              className="modal-product-image"
              onError={(e) => {
                e.target.src = "/assets/default-product.jpg";
              }}
            />
            <h3>{selectedProduct.name}</h3>

            <select
              value={selectedFlavour?.id || ""}
              onChange={(e) => {
                const flavour = selectedProduct.variations.find(
                  (v) => v.id === Number(e.target.value)
                );
                setSelectedFlavour(flavour);
                setSelectedWeight(flavour?.weights?.[0]);
              }}
            >
              {selectedProduct.variations?.length > 0 ? (
                selectedProduct.variations.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.flavour}
                  </option>
                ))
              ) : (
                <option>No variations</option>
              )}
            </select>

            <select
              value={selectedWeight?.id || ""}
              onChange={(e) => {
                if (!selectedFlavour) return;

                const weight = selectedFlavour.weights.find(
                  (w) => w.id === Number(e.target.value)
                );
                setSelectedWeight(weight);
              }}
            >
              {selectedFlavour?.weights?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.weight} – KES {Number(w.price).toLocaleString()}
                </option>
              ))}
            </select>

            <div className="qty-controls">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>

            <div style={{ textAlign: "right", marginTop: 10 }}>
              <strong>
                Total: KES {(unitPrice * quantity).toLocaleString()}
              </strong>
            </div>

            <button className="confirm-btn" onClick={confirmAddToCart}>
              Add Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}