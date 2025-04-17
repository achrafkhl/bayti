import { useState, useEffect } from "react";
import supabase from "/src/config/supabaseClient";
import Card from "/src/pages/home/card";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from 'react-router-dom';
import styles from "./favorites.module.css"

function Favorites() {
    const [sellers, setSellers] = useState([]);
    const [err, setErr] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [favorites, setFavorites] = useState({});
    const userId = localStorage.getItem("userId");

    const [cartMessage, setCartMessage] = useState(""); 
    
    useEffect(() => {
        const fetchFavorites = async () => {
            const { data, error } = await supabase
                .from("favorites")
                .select("id")
                .eq("sid",userId) // Fetch only seller IDs

            if (error) {
                setErr(error.message);
                console.log("Error fetching favorites:", error);
                return;
            }

            if (data.length > 0) {
                const favoriteIds = data.map(fav => fav.id);

                // Fetch sellers using the IDs from the favorites table
                const { data: sellersData, error: sellersError } = await supabase
                    .from("seller")
                    .select("*")
                    .in("id", favoriteIds); // Get only favorite sellers

                if (sellersError) {
                    setErr(sellersError.message);
                    console.log("Error fetching sellers:", sellersError);
                    return;
                }

                // Create a map for favorite statuses
                const favMap = {};
                favoriteIds.forEach(id => (favMap[id] = true));

                setSellers(sellersData);
                setFavorites(favMap);
            }
        };

        fetchFavorites();
    }, [userId]);

    // ✅ Function to toggle favorite status
    const handleFavoriteToggle = async (seller) => {
        const isFav = favorites[seller.id];

        if (isFav) {
            // Remove from favorites
            const { error } = await supabase
                .from("favorites")
                .delete()
                .eq("id", seller.id)
                .eq("sid", userId);

            if (error) {
                console.error("Error removing favorite:", error);
                return;
            }

            setFavorites(prev => ({ ...prev, [seller.id]: false }));
            setSellers(prev => prev.filter(item => item.id !== seller.id));
        } else {
            // Add to favorites
            const { error } = await supabase
                .from("favorites")
                .insert([{ sid: userId, id: seller.id }]);

            if (error) {
                console.error("Error adding favorite:", error);
                return;
            }

            setFavorites(prev => ({ ...prev, [seller.id]: true }));
        }
    };

    const addCart = async () => {
            const { error } = await supabase.from("cart").insert([
                { userId, product: selectedProduct.product, price: selectedProduct.price, url: selectedProduct.url, quantity }
            ]);
        
            if (error) {
                console.log(error.message);
                return;
            } else {
                setCartMessage("Item added to cart!"); 
                setTimeout(() => {
                    setSelectedProduct(null);
                    setQuantity(1);
                    setCartMessage("");
                }, 1500);
            }
        };


        
        
        return (
          <div className={styles.body}>
            <div className={styles.header}>
              <h1><em>BAYTI</em></h1>
              <ul>
                <li><Link to="/home"><i className="fas fa-home"></i> Home</Link></li>
                <li style={{ backgroundColor: "grey", padding: "10px", borderRadius: "15px" }}>
                  <Link to="/favorites"><i className="fas fa-heart"></i> Favorites</Link>
                </li>
                <li><Link to="/cart"><i className="fas fa-shopping-cart"></i> Cart</Link></li>
                <li><Link to="/cprofile"><i className="fas fa-user"></i> Profile</Link></li>
              </ul>
            </div>
        
            <div className={styles.cardseller}>
              {err && <p>{err}</p>}
              {sellers.length > 0 ? (
                <div className={styles.card_grid}>
                  {sellers.map(seller => (
                    <Card
                      key={seller.id}
                      seller={seller}
                      isFavorite={favorites[seller.id] || false}
                      onClick={() => setSelectedProduct(seller)}
                      onFavoriteToggle={() => handleFavoriteToggle(seller)}
                    />
                  ))}
                </div>
              ) : (
                <h2>No favorites found.</h2>
              )}
            </div>
        
            {selectedProduct && (
              <div className={styles.modal_overlay}>
                <div className={styles.modal}>
                  {cartMessage ? (
                    <div className={styles.cart_message}>
                      <i className="fas fa-check-circle"></i>
                      <h1>Item added to cart!</h1>
                    </div>
                  ) : (
                    <>
                      <button className={styles.close_btn} onClick={() => { setSelectedProduct(null); setQuantity(1); }}>
                        <i className="fas fa-times-circle"></i>
                      </button>
                      <div className={styles.all}>
                        <div className={styles.gauche}>
                          <img src={selectedProduct.url} alt={selectedProduct.product} />
                        </div>
                        <div className={styles.droite}>
                          <h2>{selectedProduct.product.toUpperCase()}</h2>
                          <div className={styles.review}>
                            <div className={styles.rate}>
                              {[...Array(selectedProduct.rating)].map((_, i) => (
                                <i key={i} className="fas fa-star" style={{ color: "orange" }}></i>
                              ))}
                            </div>
                            <p><i className="fas fa-mitten"></i> {selectedProduct.name}</p>
                          </div>
                          <h2 className={styles.howa}>price: {selectedProduct.price} DA</h2>
                          <div className={styles.add}>
                            <div className={styles.quantity}>
                              <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</button>
                              <span>{quantity}</span>
                              <button onClick={() => setQuantity((prev) => Math.min(9, prev + 1))}>+</button>
                            </div>
                            <button className={styles.add_to_cart} onClick={addCart}>
                              Add to Cart <i className="fas fa-cart-plus"></i>
                            </button>
                            <label onClick={() => handleFavoriteToggle(selectedProduct)} className={styles.add_to_fav}>
                              <i
                                className={favorites[selectedProduct.id] ? "fas fa-heart" : "far fa-heart"}
                                style={{ color: favorites[selectedProduct.id] ? "red" : "gray", cursor: "pointer" }}
                              ></i>
                            </label>
                          </div>
                        </div>
                      </div>
                      <h2 className={styles.howa} style={{ textAlign: "right", marginRight: "30px" }}>
                        <b>Final Price:</b> {(selectedProduct.price * quantity).toLocaleString()} DA
                      </h2>
                      <p className={styles.howa} style={{ marginTop: "-40px" }}><em>Category</em>: {selectedProduct.category}</p>
                      <p className={styles.howa}><em>Description</em>: {selectedProduct.description}</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        );
        
}

export default Favorites;
