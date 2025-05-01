import { useState, useEffect } from "react";
import supabase from "/src/config/supabaseClient";
import Card from "/src/pages/home/card";
import "@fortawesome/fontawesome-free/css/all.min.css";
import styles from './meals.module.css'
import { Link,useNavigate } from "react-router-dom";
import image1 from '../../../public/bayti2.png';
function Meals() {
    const [sellers, setSellers] = useState([]);
    const [err, setErr] = useState(null);
    const userId = sessionStorage.getItem("userId");

            const navigate = useNavigate();
        
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
                  
                        if (data?.type === "buyer") {
                          navigate("/home"); 
                        } else if (!data || error) {
                          navigate("/login"); 
                        } 
                      } catch (err) {
                        console.error("Network error:", err);
                        alert("There was an issue with the network. Please check your connection.");
                      }
                  } 
                  fetchUserRole();
                }, [navigate, userId]);
    
    useEffect(() => {
        const fetchMeals = async () => {

                const { data: sellersData, error: sellersError } = await supabase
                    .from("seller")
                    .select("*")
                    .eq("sid", userId); // Get only favorite sellers

                if (sellersError) {
                    setErr(sellersError.message);
                    console.log("Error fetching sellers:", sellersError);
                    return;
                }

                // Create a map for favorite statuses
                

                setSellers(sellersData);
            }

        fetchMeals();
    }, [userId]);


    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <Link to="/homes"><img src={image1} alt="bayti" className="header_logo_image"/></Link>
                <ul>
                    <li><Link className={styles.a} to="/homes"><i className="fas fa-home"></i> <span>Home</span></Link></li>
                    <li><Link className={styles.a} to="/new"><i className="fas fa-plus-circle"></i> <span>New meal</span></Link></li>
                    <li style={{ backgroundColor: "grey", padding: '10px', borderRadius: "15px" }}>
                        <Link className={styles.a} to="/meal"><i className="fas fa-utensils"></i> <span>My meals</span></Link>
                    </li>
                    <li><Link className={styles.a} to="/sprofile"><i className="fas fa-user"></i> <span>Profile</span></Link></li>
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
                            />
                        ))}
                    </div>
                ) : (
                    <h2>No Meals found.</h2>
                )}
            </div>
        </div>
    );
    
}

export default Meals;
