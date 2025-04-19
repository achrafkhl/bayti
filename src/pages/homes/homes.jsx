import { useState, useEffect } from "react";
import supabase from "/src/config/supabaseClient";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Item from "./item";
import { Link } from "react-router-dom";
import styles from './homes.module.css'


function Homes() {
    const [orders, setOrders] = useState([]);
    const [items, setItems] = useState([]);
    const [errFetch, setErrFetch] = useState(null);
    
    const [buyers, setBuyers] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOption,setSelectedOption]=useState("request");
    const [isLoading, setIsLoading] = useState(false);

    const userId = sessionStorage.getItem("userId");


    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;

            setIsLoading(true);
            try {
                // Fetch orders based on selected option and status
                const { data: ordersData, error: ordersError } = await supabase
                    .from("orders")
                    .select("*")
                    .eq("seller_id", userId)
                    .eq("status", selectedOption === "request" ? "pending" : "in progress");

                if (ordersError) throw ordersError;
                setOrders(ordersData || []);

                // Only fetch additional data if we have orders
                if (ordersData && ordersData.length > 0) {
                    // Fetch order items
                    const { data: orderItemsData, error: orderItemsError } = await supabase
                        .from("order_items")
                        .select("*")
                        .in("order_id", ordersData.map(order => order.id));

                    if (orderItemsError) throw orderItemsError;
                    setItems(orderItemsData || []);

                    // Fetch buyers information
                    const buyerIds = [...new Set(ordersData.map(order => order.buyer_id))];
                    const { data: buyersData, error: buyersError } = await supabase
                        .from("users")
                        .select("id, fname, lname")
                        .in("id", buyerIds);

                    if (buyersError) throw buyersError;

                    const buyersMap = buyersData.reduce((acc, buyer) => {
                        acc[buyer.id] = buyer;
                        return acc;
                    }, {});

                    setBuyers(buyersMap);
                } else {
                    // Reset related state when no orders
                    setItems([]);
                    setBuyers({});
                }
            } catch (error) {
                setErrFetch(error.message);
                console.error("Fetch error:", error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userId, selectedOption]);

    const handleOrderStatus = async (orderId, newStatus) => {
        try {
            const { error } = await supabase
                .from("orders")
                .update({ status: newStatus })
                .eq("id", orderId);

            if (error) throw error;

            setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
            setSelectedOrder(null);
        } catch (error) {
            console.error("Error updating order status:", error.message);
        }
    };

    const closeModal = () => setSelectedOrder(null); // Close the modal
    useEffect(() => {
        const first = document.getElementById("first");
        const second = document.getElementById("second");
    
        if (first && second) {
            if (selectedOption === "request") {
                first.style.backgroundColor = "#590000";
                second.style.backgroundColor = "#957878";
            } else {
                first.style.backgroundColor = "#957878";
                second.style.backgroundColor = "#590000";
            }
        }
    }, [selectedOption]);

    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <h1><em>BAYTI</em></h1>
                <ul>
                    <li className={styles.active} style={{ backgroundColor: "grey", padding: '10px', borderRadius: "15px" }}>
                        <Link to="/homes"><i className="fas fa-home"></i> Home</Link>
                    </li>
                    <li><Link to="/new"><i className="fas fa-plus-circle"></i> New meal</Link></li>
                    <li><Link to="/meal"><i className="fas fa-utensils"></i> My meals</Link></li>
                    <li><Link to="/sprofile"><i className="fas fa-user"></i> Profile</Link></li>
                </ul>
            </div>
    
            <div className={styles.container}>
                <input type="radio" name="option" id="request" checked={selectedOption === "request"} onChange={() => setSelectedOption("request")} />
                <input type="radio" name="option" id="progress" checked={selectedOption === "progress"} onChange={() => setSelectedOption("progress")} />
                <div className={styles.hd}>
                    <div className={styles.pop}>
                        <label htmlFor="request" id="first"><i className="fas fa-utensils"></i></label>
                        <label htmlFor="progress" id="second"><i className="fas fa-hourglass-half"></i></label>
                    </div>
                </div>
                {selectedOption === "request" && (
                    <div className={styles.request}>
                        {errFetch && <p className={styles.error}>{errFetch}</p>}
    
                        {isLoading ? (
                            <div className={styles.loading_spinner}>
                                <i className="fas fa-spinner"></i>
                            </div>
                        ) : (
                            orders.length > 0 ? (
                                <div className={styles.orders_container}>
                                    {orders.map((order, index) => (
                                        <div key={order.id} className={styles.order_card} onClick={() => setSelectedOrder(order)}>
                                            <div className={styles.up}>
                                                <h3>Order #{index + 1}</h3>
                                            </div>
                                            <p><strong>Buyer:</strong> {buyers[order.buyer_id] ? `${buyers[order.buyer_id].fname} ${buyers[order.buyer_id].lname.toUpperCase()}` : "Loading..."}</p>
                                            <p style={{ fontSize: "20px" }}><strong>Total Price:</strong> {order.total_price} DA</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={styles.no_orders}>
                                    <i className="fas fa-clipboard-list"></i>
                                    No pending orders
                                </p>
                            )
                        )}
                    </div>
                )}
    
                {selectedOption === "progress" && (
                    <div className={styles.progress_container}>
                        {errFetch && <p className={styles.error}>{errFetch}</p>}
    
                        {isLoading ? (
                            <div className={styles.loading_spinner}>
                                <i className="fas fa-spinner"></i>
                            </div>
                        ) : (
                            orders.length > 0 ? (
                                orders.map((order, index) => (
                                    <div key={order.id} className={styles.progress_card} onClick={() => setSelectedOrder(order)}>
                                        <div className={styles.progress_header}>
                                            <h3 className={styles.progress_title}>Order #{index + 1}</h3>
                                            <span className={styles.progress_status + " " + styles.status_in_progress}>
                                                In Progress
                                            </span>
                                        </div>
                                        <div className={styles.progress_details}>
                                            <p><strong>Buyer:</strong> {buyers[order.buyer_id] ? `${buyers[order.buyer_id].fname} ${buyers[order.buyer_id].lname.toUpperCase()}` : "Loading..."}</p>
                                            <p><strong>Total Price:</strong> {order.total_price} DA</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className={styles.no_orders}>
                                    <i className="fas fa-clipboard-list"></i>
                                    No orders in progress
                                </p>
                            )
                        )}
                    </div>
                )}
    
            </div>
    
            {selectedOrder && (
                <div className={styles.order_modal}>
                    <div className={styles.order_modal_content}>
                        <div className={styles.modal_header}>
                            <h3 className={styles.progress_title}>Order #{orders.indexOf(selectedOrder) + 1}</h3>
                            <button className={styles.close_btn} onClick={closeModal}><i className="fas fa-times"></i></button>
                        </div>
                        <div className={styles.status_badge}>
                            <span className={`${styles.progress_status} ${selectedOption === "progress" ? styles.status_in_progress : styles.status_pending}`}>
                                {selectedOption === "progress" ? "In Progress" : "Pending"}
                            </span>
                        </div>
    
                        <div className={styles.progress_details}>
                            <p><strong>Buyer:</strong> {buyers[selectedOrder.buyer_id] ? `${buyers[selectedOrder.buyer_id].fname} ${buyers[selectedOrder.buyer_id].lname.toUpperCase()}` : "Loading..."}</p>
                            <p><strong>Total Price:</strong> {selectedOrder.total_price} DA</p>
                            <h4>Items:</h4>
                            <ul className={styles.items_list}>
                                {items.filter((item) => item.order_id === selectedOrder.id).map((filteredItem) => (
                                    <Item
                                        key={filteredItem.id}
                                        product_id={filteredItem.product_id}
                                        quantity={filteredItem.quantity}
                                        price={filteredItem.price}
                                    />
                                ))}
                            </ul>
                        </div>
                        <div className={selectedOption === "progress" ? styles.progress_actions : styles.order_actions}>
                            {selectedOption === "progress" ? (
                                <button className={styles.progress_btn + " " + styles.complete_btn} onClick={() => handleOrderStatus(selectedOrder.id, "completed")}>
                                    <i className="fas fa-check"></i> Complete
                                </button>
                            ) : (
                                <>
                                    <button className={styles.accept_btn} onClick={() => handleOrderStatus(selectedOrder.id, "in progress")}>
                                        <i className="fas fa-check-circle"></i> Accept
                                    </button>
                                    <button className={styles.refuse_btn} onClick={() => handleOrderStatus(selectedOrder.id, "canceled")}>
                                        <i className="fas fa-times-circle"></i> Refuse
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
    
        </div>
    );
    
}

export default Homes;
