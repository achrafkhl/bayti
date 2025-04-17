import { useState, useEffect } from "react";
import supabase from "/src/config/supabaseClient";
import { Link } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Sela from "./sela";
import styles from './cart.module.css';
function Cart() {
    const [info, setInfo] = useState([]);
        const [err,setErr]=useState('')
        const userId = localStorage.getItem("userId");
        
        useEffect(() => {
            const fetchData =async() => {
                const {error,data} = await supabase.from("cart").select("*").eq("userId",userId);
                if(error){
                    console.log(error.message)
                    setErr(error.message)
                }
                if(data){
                    setInfo(data);
                }

            }
            fetchData();
        },[userId])
        const total = info.reduce((acc, cart) => acc + cart.price * cart.quantity, 0);

        const deleteCart = async(id)=>{
            const { error } = await supabase.from("cart").delete().eq("id", id);
            if(error){
                console.log(error.message);
                return;
            }
            setInfo((prevInfo) => prevInfo.filter((item) => item.id !== id));
        }

        const clearCart = async() =>{
            const { error } = await supabase.from("cart").delete().eq("userId",userId)
            if(error){
                console.log(error.message);
                return;
            }
            setInfo([]);
        }
        const checkOut = async () => {
            if (info.length === 0) {
                alert("Your cart is empty!");
                return;
            }
        
            if (!userId) {
                alert("You must be logged in to checkout.");
                return;
            }
        
            try {
                console.log("Fetching seller IDs...");
                
                // 1. Fetch seller_id (sid) for each product in the cart
                const productIds = info.map(item => item.product_id);
                console.log("Product IDs in cart:", productIds);
        
                const { data: products, error: productError } = await supabase
                    .from("seller")  // Ensure this is the correct table
                    .select("id, sid")  // Make sure 'id' exists in seller table
                    .in("id", productIds);
        
                if (productError) {
                    console.error("Error fetching sellers:", productError.message);
                    throw productError;
                }
                console.log("Fetched products:", products);
        
                // 2. Create a mapping of product_id → seller_id
                const productSellerMap = products.reduce((acc, product) => {
                    acc[product.id] = product.sid;
                    return acc;
                }, {});
                console.log("Product-Seller Map:", productSellerMap);
        
                // 3. Group cart items by seller
                const groupedBySeller = {};
                for (const item of info) {
                    const sellerId = productSellerMap[item.product_id];
        
                    if (!sellerId) {
                        console.error(`No seller found for product ${item.product_id}`);
                        continue; // Skip products without a seller
                    }
        
                    if (!groupedBySeller[sellerId]) groupedBySeller[sellerId] = [];
                    groupedBySeller[sellerId].push(item);
                }
                console.log("Grouped by seller:", groupedBySeller);
        
                // 4. Process each seller separately
                for (const sellerId in groupedBySeller) {
                    const sellerItems = groupedBySeller[sellerId];
                    console.log(`Processing order for seller ${sellerId}...`);
        
                    // Calculate total price
                    const totalForSeller = sellerItems.reduce((acc, item) => acc + item.price * item.quantity, 0) ;
                    console.log(`Total price for seller ${sellerId}:`, totalForSeller);
        
                    // 5. Insert order into "orders"
                    const { data: newOrder, error: orderError } = await supabase
                        .from("orders")
                        .insert([{ 
                            buyer_id: userId, 
                            seller_id: sellerId, 
                            total_price: totalForSeller, 
                            status: "pending" 
                        }])
                        .select("id")
                        .single();
        
                    if (orderError) {
                        console.error("Error inserting order:", orderError.message);
                        throw orderError;
                    }
                    console.log("Created order:", newOrder);
        
                    const orderId = newOrder.id;
        
                    // 6. Insert order items
                    const orderItems = sellerItems.map(cartItem => ({
                        order_id: orderId,
                        product_id: cartItem.product_id,
                        quantity: cartItem.quantity,
                        price: cartItem.price
                    }));
                    console.log(`Inserting order items for order ${orderId}:`, orderItems);
        
                    const { error: orderItemsError } = await supabase.from("order_items").insert(orderItems);
                    if (orderItemsError) {
                        console.error("Error inserting order items:", orderItemsError.message);
                        throw orderItemsError;
                    }
                }
        
                // 7. Clear cart
                console.log("Clearing cart...");
                await supabase.from("cart").delete().eq("userId", userId);
                setInfo([]);
                alert("Orders placed successfully!");
        
            } catch (error) {
                console.error("Checkout error:", error.message);
                alert("Failed to checkout. Please try again.");
            }
        };
        
        
         
    return(
        <div className={styles.body}>
            <div className={styles.header}>
  <h1><em>BAYTI</em></h1>
  <ul>
    <li><Link to="/home"><i className="fas fa-home"></i> Home</Link></li>
    <li><Link to="/favorites"><i className="fas fa-heart"></i> Favorites</Link></li>
    <li style={{ backgroundColor: "grey", padding: '10px', borderRadius: "15px" }}>
      <Link to="/cart"><i className="fas fa-shopping-cart"></i> Cart</Link>
    </li>
    <li><Link to="/cprofile"><i className="fas fa-user"></i> Profile</Link></li>
  </ul>
</div>

<div className={styles.all}>
  {err && <h4>{err}</h4>}

  {info.length > 0 ? (
    <>
      <div className={styles.left}>
        <div className={styles.up}>
          <div className={styles.gauche}>
            <p>Product</p>
          </div>
          <div className={styles.droite}>
            <p>Price</p>
            <p>Quantity</p>
            <p>Subtotal</p>
          </div>
        </div>

        <div className={styles.cart_flex}>
          {info.map(cart => (
            <Sela
              key={cart.id}
              cart={cart}
              total={total}
              onClick={() => deleteCart(cart.id)}
            />
          ))}
        </div>

        <div className={styles.down}>
          <button onClick={clearCart}>Clear cart</button>
          <button><Link to="/home">Return to shop</Link></button>
        </div>
      </div>

      <div className={styles.right}>
        <h1>Cart Total</h1>
        <div className={styles.center}>
          <div className={styles.first}>
            <p>Subtotal :</p>
            <p>{total.toLocaleString()} DA</p>
          </div>
          <div className={`${styles.first} ${styles.ana}`}>
            <p>Shipping :</p>
            <p>440 DA</p>
          </div>
          <div className={`${styles.first} ${styles.total}`}>
            <p>TOTAL :</p>
            <p><strong>{(total + 440).toLocaleString()} DA</strong></p>
          </div>
        </div>
        <button onClick={checkOut}>Proceed To Checkout</button>
      </div>
    </>
  ) : (
    <h2>No items found.</h2>
  )}
</div>

        </div>
    )
}

export default Cart