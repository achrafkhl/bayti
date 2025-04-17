import { useState, useEffect } from "react";
import supabase from "/src/config/supabaseClient";
import { Link } from "react-router-dom";
import styles from '/src/pages/forget/forget.module.css'
function Reset() {
  const [pass, setPass] = useState("");
  const [conf, setConf] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        alert("No authenticated user found. Please log in.");
        window.location.href = "/login";
        console.log(error)
      }
    };
    fetchUser();
  }, []);

  const conff = async () => {
    if (pass !== conf) {
      alert("Passwords do not match!");
      return;
    }

    if (!user) {
      alert("User not authenticated. Please log in.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: pass });

    if (error) {
      alert("Error updating password: " + error.message);
    } else {
      alert("Password updated successfully! Please log in.");
      await supabase.auth.signOut();
      window.location.href = "/login";
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.conf} id="confirmation">
      <input 
        type="password" 
        placeholder="New password" 
        value={pass} 
        onChange={(e) => setPass(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Confirm password" 
        value={conf} 
        onChange={(e) => setConf(e.target.value)} 
      />
      <button className={styles.but} onClick={conff}>Confirm</button>
    </div>
    </div>
  );
}

export default Reset;
