import { useState, useEffect } from "react";
import supabase from "/src/config/supabaseClient";
import styles from "./homes.module.css"
const Item = ({ product_id, quantity, price }) => {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const { data, error } = await supabase.from("seller").select("*").eq("id", product_id).single();
            if (error) {
                console.error("Error fetching product:", error.message);
                setError(error.message);
            } else {
                setProduct(data);
            }
        };

        fetchProduct();
    }, [product_id]);


    return (
        <li>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {product ? (
                <div className={styles.all}>
                    <div className={styles.left}>
                        <img src={product.url} alt={product.product} width="50" />
                        {product.product}
                    </div>
                    <span> Quantity: {quantity} </span>
                    <span> subtotal: {price * quantity} DA</span>
                </div>
            ) : (
                <span>Loading product...</span>
            )}
        </li>
    );
    
};

export default Item;