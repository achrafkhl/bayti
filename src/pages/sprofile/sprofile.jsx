import { useState,useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'
import supabase from '/src/config/supabaseClient'
import { Link } from 'react-router-dom';
import styles from '/src/pages/cprofile/cprofile.module.css'

function Sprofile() {
    const [selectedOption, setSelectedOption] = useState("info");
    const [mail,setMail]=useState('');
    const [tele,setTele]=useState('');
    const [newMail,setNewMail]=useState('');
    const [newPhone,setNewPhone]=useState('');
    const [newUser,setNewUser]=useState('');
    const [name,setName]=useState('');
    const [lname,setLname]=useState('');

    const [information,setInformation]=useState(false);
    const [perInfo,setPerInfo]=useState(true)

    const userId = sessionStorage.getItem("userId");


    const [current,setCurrent] = useState('');
    const [newpass,setNewpass] = useState('');
    const [confirm,setconfirm] = useState('');

    const [showModal, setShowModal] = useState(false);

    const [orders,setOrders]= useState("");
    const [errOrder,seterrOrder] = useState(null);

    const [showAllOrders, setShowAllOrders] = useState(false);
    const [displayedOrders, setDisplayedOrders] = useState([]);

    const [items,setItems] = useState("")
    const [errItem,setErrItem] = useState(null);
    const [showItem,setShowItem] = useState(null);

    

    useEffect(() => {
        if (selectedOption === "info") {
            const fetchInfo = async () => {
                const { data, error } = await supabase.from('users').select('*').eq("id", userId).single();
                if (error) console.log(error);
                if (data) {
                    setMail(data.email);
                    setTele(data.phone);
                    setName(data.name);
                    setLname(data);
                }
            };
            if(information){
                document.getElementById('mail').style.display='flex'
            document.getElementById('tele').style.display='flex'
            document.getElementById('name').style.display='flex'
            document.getElementById('mail-but').style.display='flex'
            document.getElementById('phone-but').style.display='flex'
            document.getElementById('user-but').style.display='flex'
            }
            fetchInfo();
        }
    }, [selectedOption, userId,information]);


    const changePassword = async() => {
        if(newpass!==confirm){
            alert("Passwords do not match!");
            return;
        }
        const {data,error} = await supabase.from('users').select('').eq("id",userId).single()
        if(error){
            console.log(error)
            return;
        }
        if(data){
            setMail(data.email);
        }
        const {error:signInError} = await supabase.auth.signInWithPassword({
            email : mail,
            password: current,
        });
        if(signInError){
            alert("current password is incorrect.");
            return;
        }
        const { error: updateError } = await supabase.auth.updateUser({
            password: newpass,
          });
      
          if (updateError) {
            alert("Failed to update password. Try again.");
          } else {
            alert("Password updated successfully!");
            window.location.href = "/home";
          }
    };

    const change1 = () => {
        cancelChange2();
        cancelChange3();
        document.getElementById('mail').style.display='none'
        document.getElementById('mail-but').style.display='none'
        document.getElementById('email').style.display='flex'
    }
    const change2 = () => {
        cancelChange1();
        cancelChange3();
        document.getElementById('tele').style.display='none'
        document.getElementById('phone-but').style.display='none'
        document.getElementById('phone').style.display='flex'
    }
    const change3 = () => {
        cancelChange2();
        cancelChange1();
        document.getElementById('name').style.display='none'
        document.getElementById('user-but').style.display='none'
        document.getElementById('user').style.display='flex'
    }
    const changeEmail = async() => {
        const { data, error } = await supabase.auth.updateUser({ email: newMail });

    if (error) {
        console.error("Error updating email:", error.message,data);
        alert("Failed to update email: " + error.message);
        return
    }
        const {data:userData,error:userError}=await supabase.from('users').update({email:newMail}).eq('id',userId)
        if(userError){
            console.log(userError,userData);
            return;
        }
        else{
            alert("A confirmation email has been sent to your old email address. Please verify it to complete the update.");

    setTimeout(async () => {
        await supabase.auth.signOut(); // Force logout
        alert("Please log in again to verify your email change.");
        window.location.href = "/login"; // Redirect to login page
    }, 5000);
        }

    }
    const changePhone = async() => {
        const {data:userData,error:userError}=await supabase.from('users').update({phone:newPhone}).eq('id',userId)
        if(userError){
            console.log(userError,userData);
            return;
        }
        else{
            alert('phone number updated succesfuly')
            window.location.href = "/cprofile";
        }
    }
    const changeUser = async() => {
        const {data:userData,error:userError}=await supabase.from('users').update({name:newUser}).eq('id',userId)
        if(userError){
            console.log(userError,userData);
            return;
        }
        const {data,error}=await supabase.from('seller').update({name:newUser}).eq('id',userId)
        if(error){
            console.log(error,data);
            return;
        }
        else{
            alert('Username updated succesfuly')
            window.location.href = "/cprofile";
        }
    }

    const cancelChange1 = () => {
        setNewMail("");
        document.getElementById('email').style.display = 'none';
        document.getElementById('mail').style.display = 'flex';
        document.getElementById('mail-but').style.display = 'flex';
    };
    
    const cancelChange2 = () => {
        setNewPhone("");
        document.getElementById('phone').style.display = 'none';
        document.getElementById('tele').style.display = 'flex';
        document.getElementById('phone-but').style.display = 'flex';
    };
    
    const cancelChange3 = () => {
        setNewUser("");
        document.getElementById('user').style.display = 'none';
        document.getElementById('name').style.display = 'flex';
        document.getElementById('user-but').style.display = 'flex';
    };
    
    const signOut = async () => {
        
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error.message);
            alert("Failed to sign out. Try again.");
        } else {
            window.location.href = "/login";
        }
    };

    useEffect(() => {
        if (selectedOption === "history") {
            const fetchOrdersAndItems = async () => {
                try {
                    const { data: orderData, error: orderError } = await supabase
                        .from("orders")
                        .select("*")
                        .eq("seller_id", userId);
    
                    if (orderError) {
                        console.log(orderError.message);
                        seterrOrder(orderError.message);
                        setOrders(null);
                        return;
                    }
    
                    if (orderData) {
                        setOrders(orderData);
                        setDisplayedOrders(orderData.slice(0, 10));
    
                        const orderIds = orderData.map(o => o.id);
    
                        const { data: itemData, error: itemError } = await supabase
                            .from("order_items")
                            .select("*")
                            .in("order_id", orderIds);
    
                        if (itemError) {
                            setErrItem(itemError.message);
                            console.log(errItem)
                            setItems({});
                            return;
                        }
    
                        const productIds = itemData.map(item => item.product_id);
    
                        const { data: productData, error: productError } = await supabase
                            .from("seller")
                            .select("id, product, url") // Use 'product' here instead of 'name'
                            .in("id", productIds);
    
                        if (productError) {
                            console.error(productError);
                            return;
                        }
    
                        // Create a map of product_id to product details
                        const productMap = {};
                        productData.forEach(product => {
                            productMap[product.id] = product;
                        });
    
                        // Merge product info into each item
                        const grouped = {};
                        itemData.forEach(item => {
                            if (!grouped[item.order_id]) {
                                grouped[item.order_id] = [];
                            }
    
                            const productInfo = productMap[item.product_id] || {};
                            grouped[item.order_id].push({
                                ...item,
                                product_name: productInfo.product, // Use 'product' here
                                product_url: productInfo.url
                            });
                        });
    
                        setItems(grouped);
                    }
                } catch (e) {
                    console.error("Unexpected error fetching orders/items", e);
                }
            };
    
            fetchOrdersAndItems();
        }
    }, [userId, selectedOption,errItem]);
    
    
    
    
    const handleShowMore = () => {
        setShowAllOrders(true);
        setDisplayedOrders(orders);
    };

    const editProfile = () =>{
        setPerInfo(false);
        setInformation(true);
    }
    const backProfile = () =>{
        setPerInfo(true);
        setInformation(false);
    }


    
        
    return (
        <div className={styles.body}>
          <div className={styles.header}>
            <h1><em>BAYTI</em></h1>
            <ul>
              <li>
                <Link to="/homes"><i className="fas fa-home"></i> Home</Link>
              </li>
              <li><Link to="/new"><i className='fas fa-plus-circle'></i> New meal</Link></li>
              <li><Link to="/meal"><i className="fas fa-utensils"></i> My meals</Link></li>
              <li style={{ backgroundColor: "grey", padding: '10px', borderRadius: "15px" }}>
                <Link to='/sprofile'><i className="fas fa-user"></i> Profile</Link>
              </li>
            </ul>
          </div>
          <div className={styles.all}>
          <input type="radio" name="tab" id="info" className="un" checked={selectedOption === "info"} onChange={() => setSelectedOption("info")} />
<input type="radio" name="tab" id="pass" className="deux" checked={selectedOption === "pass"} onChange={() => setSelectedOption("pass")} />
<input type="radio" name="tab" id="history" className="troi" checked={selectedOption === "history"} onChange={() => setSelectedOption("history")} />
<input type="radio" name="tab" id="contact" className="quatre" checked={selectedOption === "contact"} onChange={() => setSelectedOption("contact")} />
<input type="radio" name="tab" id="out" className="cinq" checked={selectedOption === "out"} onChange={() => setSelectedOption("out")} />

<div className={styles.tabs}>
                <label htmlFor="info" className={styles.lwl}style={{position:"relative"}}>Personal information</label>
                <label htmlFor="pass">Change password</label>
                <label htmlFor="history"><i className="fas fa-history"></i> orders history</label>
                <label htmlFor="contact"><i className="fas fa-phone"></i> Contact Us</label>
                <label htmlFor="out" onClick={() => setShowModal(true)}><i className="fas fa-sign-out-alt"></i> Sign out</label>
                <div
                  className={styles.run}
                  style={{
                    top:
                      selectedOption === "info"
                        ? "30px"
                        : selectedOption === "pass"
                        ? "90.8px"
                        : selectedOption === "history"
                        ? "151.6px"
                        : selectedOption === "contact"
                        ? "212.4px"
                        : "273.2px",
                    left: "0"
                  }}
                ></div>
              </div>
            <div className={styles.content}>
              <div className={styles.run} style={{
                top: selectedOption === "info" ? "112px" : selectedOption === "pass" ? "172.8px" : selectedOption === "history" ? "233.6px" : selectedOption === "contact" ? "294.4px" : "355.2px",
                left: "0"
              }}></div>
              {selectedOption === "info" && (
                                <div className={styles.all_info}>
                                  {perInfo && (
                                    <div className={styles.per_info}>
                                      <div className={styles.fcube}>
                                        <i className="fas fa-user-circle"></i>
                                        {lname && <h1>{lname.fname} {lname.lname.toUpperCase()}</h1>}
                                        {lname && <p>{lname.type}</p>}
                                        <button onClick={editProfile}>Edit Profile</button>
                                      </div>
                                    </div>
                                  )}
                      
                                  {information && (
                                    <div className={styles.info}>
                                      <div className={styles.back} onClick={backProfile}>
                                        <i className="fas fa-arrow-left"></i>
                                      </div>
                                      <h1>Personal Information</h1>
                                      <p>Update your personal information and contact details</p>
                      
                                      <div className={styles.cont}>
                                        <div className={styles.email}>
                                          <p>Email Address</p>
                                          <div id="mail" className={styles.wahd}>
                                            <p>{mail}</p>
                                          </div>
                                          <button onClick={change1} className={styles.mail_but} id= "mail-but">Change Email</button>
                                          <div id="email" className={styles.wahdd} >
                                            <input type="email" placeholder="Enter new email" value={newMail} onChange={(e) => setNewMail(e.target.value)} />
                                            <button onClick={changeEmail}>Update</button>
                                            <button className={styles.cancel} onClick={cancelChange1}>
                                              <i className="fas fa-times-circle"></i>
                                            </button>
                                          </div>
                                        </div>
                      
                                        <div className={styles.phone}>
                                          <p>Phone Number</p>
                                          <div id="tele" className={styles.zouj}>
                                            <p>0{tele}</p>
                                          </div>
                                          <button onClick={change2} className={styles.mail_but} id= "phone-but">Change Phone</button>
                                          <div id="phone" className={styles.zoujj}>
                                            <p>+213</p>
                                            <input type="number" placeholder="Enter new phone number" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
                                            <button onClick={changePhone}>Update</button>
                                            <button className={styles.cancel} onClick={cancelChange2}>
                                              <i className="fas fa-times-circle"></i>
                                            </button>
                                          </div>
                                        </div>
                      
                                        <div className={styles.name}>
                                          <p>Username</p>
                                          <div id="name" className={styles.tlatha}>
                                            <p>{name}</p>
                                          </div>
                                          <button onClick={change3} id="user-but" className={styles.user_but}>Change Username</button>
                                          <div id="user" className={styles.tlathaa}>
                                            <input type="text" placeholder="Enter new username" value={newUser} onChange={(e) => setNewUser(e.target.value)} />
                                            <button onClick={changeUser}>Update</button>
                                            <button className={styles.cancel} onClick={cancelChange3}>
                                              <i className="fas fa-times-circle"></i>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
              {selectedOption === "pass" && (
                <div className={styles.pass}>
                  <input type="password" placeholder='current password' value={current} onChange={(e) => setCurrent(e.target.value)} />
                  <input type="password" placeholder='new password' value={newpass} onChange={(e) => setNewpass(e.target.value)} />
                  <input type="password" placeholder='confirm new password' value={confirm} onChange={(e) => setconfirm(e.target.value)} />
                  <button onClick={changePassword}>change</button>
                  <Link to="/forget">forget password?</Link>
                </div>
              )}
              {selectedOption === "out" && showModal && (
                                <div className={styles.modal_overlay}>
                                  <div className={styles.modal_content}>
                                    <h2>Confirm Sign Out</h2>
                                    <p>Are you sure you want to sign out?</p>
                                    <div className={styles.modal_buttons}>
                                      <button onClick={signOut} className={styles.confirm_btn}>Yes</button>
                                      <button onClick={() => { setShowModal(false); setSelectedOption("info"); }} className={styles.cancel_btn}>No</button>
                                    </div>
                                  </div>
                                </div>
                              )}
              {selectedOption === "history" && (
                                <div className={styles.history}>
                                  {errOrder && <p className={styles.error}>{errOrder}</p>}
                                  {orders && (
                                    <div className={styles.historique}>
                                      <div className={styles.up}>
                                        <p>Order ID</p>
                                        <p>Date</p>
                                        <p>Total Price</p>
                                        <p>Status</p>
                                        <p>Actions</p>
                                      </div>
                                      <div className={styles.down}>
                                        {displayedOrders.map((order) => (
                                          <div key={order.id} className={styles.columns}>
                                            <p>#{order.id}</p>
                                            <p>{new Date(order.created_at).toLocaleDateString('en-US', {
                                              year: 'numeric', month: 'long', day: 'numeric',
                                              hour: '2-digit', minute: '2-digit'
                                            })}</p>
                                            <p>{order.total_price} DA</p>
                                            <p className={styles[`status_${order.status}`]}>
                                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </p>
                                            <button className={styles.more_info_btn} onClick={() => setShowItem(order)}>More Info</button>
                                          </div>
                                        ))}
                                        {!showAllOrders && orders.length > 10 && (
                                          <div className={styles.show_more_container}>
                                            <button className={styles.show_more_btn} onClick={handleShowMore}>Show More</button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                      
                                  {showItem && (
                                    <div className={styles.history_modal}>
                                      <div className={styles.history_modal_content}>
                                        <span className={styles.close} onClick={() => setShowItem(null)}>&times;</span>
                                        <h2>Order Details</h2>
                                        <div className={styles.order_details}>
                                          <p><strong>Order ID</strong><span>#{showItem.id}</span></p>
                                          <p><strong>Order Date</strong><span>{new Date(showItem.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                          })}</span></p>
                                          <p><strong>Total Amount</strong><span>{showItem.total_price} DA</span></p>
                                          <p><strong>Order Status</strong><span className={styles[`status_${showItem.status}`]}>
                                            {showItem.status.charAt(0).toUpperCase() + showItem.status.slice(1)}
                                          </span></p>
                                        </div>
                      
                                        {items && items[showItem.id] && items[showItem.id].length > 0 && (
                                          <div className={styles.order_items}>
                                            <h3>Order Items</h3>
                                            {items[showItem.id].map((item, index) => (
                                              <div key={index} className={styles.order_item}>
                                                <img src={item.product_url} alt={item.product_name} />
                                                <div className={styles.order_item_content}>
                                                  <div className={styles.order_item_name}>
                                                    <span>{item.product_name}</span>
                                                  </div>
                                                  <div className={styles.item_details}>
                                                    <span>Quantity: {item.quantity}</span>
                                                    <span>Price: {item.price} DA</span>
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
            </div>
          </div>
        </div>
      );
      
}
export default Sprofile