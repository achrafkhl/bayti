import { useState, useEffect } from "react";
import supabase from '/src/config/supabaseClient';
import Card from "./card";
import '@fortawesome/fontawesome-free/css/all.min.css';
import MultiRangeSlider from "multi-range-slider-react";
import styles from"./home.module.css"
import { Link,useNavigate } from "react-router-dom";
import image1 from "../../assets/first.png";
import image2 from "../../assets/second.jpeg";
import image3 from "../../assets/third.jpg";
import image4 from "../../assets/forth.jpg";
import image5 from '../../../public/bayti2.png';
import renderStars from "../../config/stars"
function Home() {
    const [sellers, setSellers] = useState([]);
    const [err, setErr] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [showReviews, setShowReviews] = useState(false);
    const itemsPerPage = 12;

    const [cartMessage, setCartMessage] = useState(""); 

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedRating, setSelectedRating] = useState("All");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);
    
    const [searchQuery, setSearchQuery] = useState("");
    const userId = sessionStorage.getItem("userId");

    const navigate = useNavigate();
    const [connection,setConnection]=useState(false);

    useEffect(() => {
      const fetchUserRole = async() => {
        if (!userId) {
            navigate("/login");
          }
          try {
            const { data, error } = await supabase
              .from("users")
              .select("type")
              .eq("id", userId)
              .single();
    
            if (data?.type === "seller") {
              navigate("/homes"); 
            } else if (!data || error) {
              navigate("/login"); 
            }
          } catch (err) {
            setConnection(true);
            console.error("Network error:", err);
            alert("There was an issue with the network. Please check your connection.");
          }
      } 
      fetchUserRole();
    }, [navigate, userId]);

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handleInput = (e) => {
        setMinPrice(e.minValue);
        setMaxPrice(e.maxValue);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };
    
    
    const filteredSellers = sellers.filter(seller => {
        const matchesCategory = selectedCategory === "All" || seller.category === selectedCategory;
        const matchesRating =
            selectedRating === "All" ||
            (selectedRating === "2" && seller.rating >= 2) ||
            (selectedRating === "3" && seller.rating >= 3) ||
            (selectedRating === "4" && seller.rating >= 4) ||
            (selectedRating === "5" && seller.rating === 5);
        const matchesPrice = seller.price >= minPrice && seller.price <= maxPrice;
        
        
        const matchesSearch = 
            seller.product.toLowerCase().includes(searchQuery.toLowerCase()) || 
            seller.name.toLowerCase().includes(searchQuery.toLowerCase());
    
        return matchesCategory && matchesRating && matchesPrice && matchesSearch;
    });
    
    const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSellers.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRatingChange = (rating) => {
        setSelectedRating(rating);
    };
    
    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.from('seller').select();
            if (error) {
                setErr(error.message);
                setSellers([]);
                console.log('Error:', error);
            } else {
                setSellers(data);
                setErr(null);
            }
        };
        fetchData();
    }, []);

    
    useEffect(() => {
        if (selectedProduct) {
            const checkFavoriteStatus = async () => {
                const { data, error } = await supabase
                    .from("favorites")
                    .select("*")
                    .eq("sid", userId)
                    .eq("id", selectedProduct.id);

                if (error) {
                    console.error("Error fetching favorites:", error);
                } else {
                    setIsFavorite(data.length > 0); 
                }
            };
            checkFavoriteStatus();
        }
    }, [selectedProduct,userId]);

    const handleFavoriteToggle = async () => {
        if (isFavorite) {

            const { error } = await supabase
                .from("favorites")
                .delete()
                .eq("sid", userId)
                .eq("id", selectedProduct.id);

            if (error) {
                console.error("Error removing favorite:", error);
                return;
            }
            setIsFavorite(false);
        } else {
            
            const { error } = await supabase
                .from("favorites")
                .insert([{ id: selectedProduct.id, sid: userId }]);

            if (error) {
                console.error("Error adding favorite:", error);
                return;
            }
            setIsFavorite(true);
        }
    };

    const addCart = async () => {
        const { error } = await supabase.from("cart").insert([
            { userId,product_id:selectedProduct.id ,product: selectedProduct.product, price: selectedProduct.price, url: selectedProduct.url, quantity }
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

    useEffect(() => {
        if (selectedProduct) {
            const fetchReviews = async () => {
                const { data, error } = await supabase
                    .from('order_items')
                    .select('*')
                    .eq('product_id', selectedProduct.id)

                if (error) {
                    console.error('Error fetching reviews:', error);
                } else {
                    setReviews(data || []);
                }
            };
            fetchReviews();
        }
    }, [selectedProduct]);

    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <Link to="/home"><img src={image5} alt="bayti" /></Link>
                <ul>
                    <li style={{ backgroundColor: "grey", padding: '10px', borderRadius: "15px" }} >
                        <Link to="/home" className={styles.a}><i className="fas fa-home"></i> <span>Home</span></Link>
                    </li>
                    <li><Link className={styles.a} to="/favorites"><i className='fas fa-heart'></i> <span>Favorites</span></Link></li>
                    <li><Link className={styles.a} to="/cart"><i className="fas fa-shopping-cart"></i> <span>Cart</span></Link></li>
                    <li><Link className={styles.a} to={`/cprofile`}><i className="fas fa-user"></i> <span>Profile</span></Link></li>
                </ul>
            </div>
    
            {connection ? (
                                        <div className={styles.loading_spinner}>
                                            <i className="fas fa-spinner"></i>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={styles.all}>
                <div className={`${styles.left} ${showFilters ? styles.active : ''}`}>
                    <h2>Filter Meals <i className="fas fa-sliders-h"></i></h2>
    
                    <hr />
                    <h3 className={styles.hola}>Categories:</h3>
    
                    <ul className={styles.filter_list}>
                        {["All", "sweet", "traditional", "cold", "fast food"].map((category) => {
                            const id = `category-${category}`;
                            return (
                                <li key={category} className={styles.category_item}>
                                    <input
                                        type="radio"
                                        id={id}
                                        name="category"
                                        value={category}
                                        checked={selectedCategory === category}
                                        onChange={() => handleCategoryChange(category)}
                                        hidden
                                    />
                                    <label htmlFor={id} className={styles.full_label}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                    <hr />
                    <h3 className={styles.hola}>Ratings:</h3>
                    <ul className={styles.filter_list}>
                        {["All", "2", "3", "4", "5"].map((rating) => {
                            const id = `rating-${rating}`;
                            return (
                                <li key={rating} className={styles.rating_item}>
                                    <input
                                        type="checkbox"
                                        id={id}
                                        name="rating"
                                        value={rating}
                                        checked={selectedRating === rating}
                                        onChange={() => handleRatingChange(rating)}
                                        hidden
                                    />
                                    <label htmlFor={id} className={styles.full_label}>
                                        {rating === "All" ? "All Ratings" : (
                                            <>
                                                {[...Array(parseInt(rating))].map((_, i) => (
                                                    <i key={i} className="fas fa-star" style={{ color: "orange", marginRight: "4px" }}></i>
                                                ))}
                                                {rating === "5" ? " 5 Stars Only" : ` ${rating} Stars & Up`}
                                            </>
                                        )}
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
    
    
                    <hr />
    
    
                    <h3 className={styles.hola}>Prices:</h3>
                    <div className={styles.price_filter}>
                        <MultiRangeSlider
                            min={0}
                            max={1000}
                            step={10}
                            minValue={minPrice}
                            maxValue={maxPrice}
                            onInput={handleInput}
                            ruler={false} // Hide default ruler
                            barLeftColor="#ccc"
                            barInnerColor="rgba(89, 0, 0, 1)" // Active range color
                            barRightColor="#ccc"
                            thumbLeftColor="rgba(89, 0, 0, 1)" // Left handle color
                            thumbRightColor="rgba(89, 0, 0, 1)"
                            style={{border:"none",boxShadow:"none",backgroundColor:"transparent"}}
                        />
                        <p style={{marginLeft:"30px",marginTop:"0px",paddingBottom:"30px"}}>price: <b>0 - 1000 DA</b></p>
                    </div>
                    <hr />
                </div>
    
                <button className={styles.filter_toggle} onClick={toggleFilters}>
                    <i className="fas fa-filter"></i>
                </button>
    
                <div className={styles.right}>
                    <div className={styles.imag}>
                        <div className={styles.container}>
                            <img src={image1} className={styles.i1} />
                            <img src={image2} className={styles.i2} />
                            <img src={image3} className={styles.i3} />
                            <img src={image4} className={styles.i4} />
                            <img src={image1} className={styles.i5} />
                        </div>
                    </div>
                    <div className={styles.search}>
                        <div className={styles.in}>
                            <i className="fas fa-search"></i>
                            <input 
                                type="text" 
                                className={styles.srch}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for a product or seller..."
                            />
                        </div>
                    </div>
    
                    <div className={styles.cardseller}>
                        {err && (<p>{err}</p>)}
                        {filteredSellers.length > 0 && (
                            <>
                                <div className={styles.card_grid}>
                                    {currentItems.map(seller => (
                                        <Card key={seller.id} seller={seller} onClick={() => {
                                            setSelectedProduct(seller);
                                        }} />
                                    ))}
                                </div>
                                {totalPages > 1 && (
                                    <div className={styles.pagination}>
                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => paginate(index + 1)}
                                                className={`${styles.page_button} ${currentPage === index + 1 ? styles.active : ''}`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
    
            {selectedProduct && (
                <div className={styles.modal_overlay}>
                    <div className={styles.modal}>
                        {cartMessage ? (
                            <div className={styles.cart_message}>  
                               <i className="fas fa-check-circle"></i> 
                                <h1> Item added to cart!</h1>
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
                                                {renderStars(selectedProduct.rating)}
                                            </div>
                                            <p><i className="fas fa-mitten"></i> {selectedProduct.name}</p>
                                        </div>
                                        <h2>price: {selectedProduct.price} DA</h2>
                                        <div className={styles.add}>
                                            <div className={styles.quantity}>
                                                <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</button>
                                                <span>{quantity}</span>
                                                <button onClick={() => setQuantity((prev) => Math.min(9, prev + 1))}>+</button>
                                            </div>
                                            <button className={styles.add_to_cart} onClick={addCart}>
                                                Add to Cart <i className="fas fa-cart-plus"></i>
                                            </button>
                                            <label onClick={handleFavoriteToggle} className={styles.add_to_fav}>
                                                <i className={isFavorite ? "fas fa-heart" : "far fa-heart"}
                                                    style={{ color: isFavorite ? "red" : "gray", cursor: "pointer" }}></i>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <h2 className={styles.howaa} style={{ textAlign: "right", marginRight: "30px" }}>
                                    <b>Final Price:</b> {(selectedProduct.price * quantity).toLocaleString()} DA
                                </h2>
                                <p className={styles.howa} style={{ marginTop: "-40px" }}><em>Category</em>: {selectedProduct.category}</p>
                                <p className={styles.howa}><em>Description</em>: {selectedProduct.description}</p>
                                
                                {/* Modern Reviews Tab */}
                                <div className={styles.reviews_tab}>
                                    <div 
                                        className={`${styles.tab_header} ${showReviews ? styles.active : ''}`}
                                        onClick={() => {
                                            setShowReviews(!showReviews);
                                            if (!showReviews) {
                                                const fetchReviews = async () => {
                                                    const { data, error } = await supabase
                                                        .from('order_items')
                                                        .select('*')
                                                        .eq('product_id', selectedProduct.id);

                                                    if (error) {
                                                        console.error('Error fetching reviews:', error);
                                                    } else {
                                                        setReviews(data || []);
                                                    }
                                                };
                                                fetchReviews();
                                            }
                                        }}
                                    >
                                        <div className={styles.tab_icon}>
                                            <i className="fas fa-star"></i>
                                        </div>
                                        <div className={styles.tab_content}>
                                            <span className={styles.tab_title}>Reviews</span>
                                            <span className={styles.tab_count}>
                                                {reviews.filter(r => r.review).length} reviews
                                            </span>
                                        </div>
                                        <div className={styles.tab_arrow}>
                                            <i className={`fas fa-chevron-${showReviews ? 'up' : 'down'}`}></i>
                                        </div>
                                    </div>

                                    {/* Reviews Section */}
                                    <div className={`${styles.reviews_section} ${showReviews ? styles.show : ''}`}>
                                        <div className={styles.reviews_container}>
                                            {reviews.filter(r => r.review).length > 0 ? (
                                                reviews
                                                    .filter(r => r.review)
                                                    .map((review, index) => (
                                                        <div key={index} className={styles.review_item}>
                                                            <div className={styles.review_header}>
                                                                <div className={styles.review_rating}>
                                                                    {renderStars(review.rate)}
                                                                </div>
                                                                <span className={styles.review_date}>
                                                                    {new Date(review.rated_at).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <p className={styles.review_text}>{review.review}</p>
                                                        </div>
                                                    ))
                                            ) : (
                                                <p className={styles.no_reviews}>No reviews yet</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </>
                        )}
                    </div>
                </div>
            )}
                                        </>
                                    )}

            
    
            <footer></footer>
        </div>
    );
    
}

export default Home;
