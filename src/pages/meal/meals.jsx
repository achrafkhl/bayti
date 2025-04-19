import { useState, useEffect } from "react";
import supabase from "/src/config/supabaseClient";
import Card from "/src/pages/home/card";
import "@fortawesome/fontawesome-free/css/all.min.css";
import styles from './meals.module.css'
import { Link } from "react-router-dom";
function Meals() {
    const [sellers, setSellers] = useState([]);
    const [err, setErr] = useState(null);
    const userId = sessionStorage.getItem("userId");

 
    
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
                <h1><em>BAYTI</em></h1>
                <ul>
                    <li className={styles.active}>
                        <Link to="/homes"><i className="fas fa-home"></i> Home</Link>
                    </li>
                    <li>
                        <Link to="/new"><i className="fas fa-plus-circle"></i> New meal</Link>
                    </li>
                    <li style={{ backgroundColor: "grey", padding: '10px', borderRadius: "15px" }}>
                        <Link to="/meal"><i className="fas fa-utensils"></i> My meals</Link>
                    </li>
                    <li>
                        <Link to="/sprofile"><i className="fas fa-user"></i> Profile</Link>
                    </li>
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
