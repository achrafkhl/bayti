import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "/src/config/supabaseClient";
import styles from "/src/pages/forget/forget.module.css";

function Reset() {
  const [pass, setPass] = useState("");
  const [conf, setConf] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session || !session.user) {
        alert("No authenticated reset session found. Please use the reset link from your email.");
        navigate("/login");
      } else {
        setUser(session.user);
      }
    };

    checkSession();
  }, [navigate]);

  const conff = async () => {
    if (pass !== conf) {
      alert("Passwords do not match!");
      return;
    }

    if (!user) {
      alert("User not authenticated. Please use the reset link from your email.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: pass });

    if (error) {
      alert("Error updating password: " + error.message);
    } else {
      alert("Password updated successfully! Please log in.");
      await supabase.auth.signOut();
      navigate("/login");
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
