import { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import supabase from "/src/config/supabaseClient";
import styles from "./forget.module.css";

function Forget() {
    const [selectedOption, setSelectedOption] = useState("email");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const [, setFetError] = useState(null);
    const [user, setUser] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetData = async () => {
            const { data, error } = await supabase.from("users").select();
            if (error) {
                console.log("There is an error:", error);
                setFetError(error);
                setUser([]);
            }
            if (data) {
                setFetError(null);
                setUser(data);
            }
        };
        fetData();
    }, []);

    const forgett = async () => {
        if (selectedOption === "email") {
            setNumber("")
            const used = user.find((user) => user.email?.toLowerCase() === email.toLowerCase());
            if (!used) {
                document.getElementById("imail").innerHTML = "<p style='color:red;'>No account found with this email.</p>";
                return;
            }

            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset`,
            });

            if (error) {
                alert("Error sending reset email: " + error.message);
            }
            if (data) {
                localStorage.setItem("userEmail", email);
                alert("Check your email for the password reset link.");
                navigate("/login")
            }
        }
        if (selectedOption === "telephone") {
            setEmail("")
            const use = user.find((user) => user.phone?.toString() === number.toString());
            if (!use) {
                document.getElementById("tele").innerHTML = "<p style='color:red;'>No account found with this number.</p>";
                return;
            }
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.c1}></div>
            <div className={styles.c2}></div>
            <div className={styles.c3}></div>
            <div className={styles.c4}></div>
            <div className={styles.c5}></div>
            <div className={styles.container} id="container">
                <h1>Update password</h1>
                <div className={styles.up}>
                    <p>How would you like to reset your password?</p>
                    <div className={styles.mail}>
                        <input
                            type="radio"
                            id="email"
                            name="choose"
                            checked={selectedOption === "email"}
                            onChange={() => setSelectedOption("email")}
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className={styles.mail}>
                        <input
                            type="radio"
                            id="telephone"
                            name="choose"
                            checked={selectedOption === "telephone"}
                            onChange={() => setSelectedOption("telephone")}
                        />
                        <label htmlFor="telephone">Text message (SMS)</label>
                    </div>
                </div>
                <div className={styles.all}>
                    {selectedOption === "telephone" && (
                        <div className={styles.email}>
                            <p>We will text you a verification code to reset your password.</p>
                            <input
                                type="number"
                                id="phone"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                placeholder="Enter phone number"
                            />
                            <div id="tele"></div>
                        </div>
                    )}

                    {selectedOption === "email" && (
                        <div className={styles.email}>
                            <p>We will send you an email with instructions on how to reset your password.</p>
                            <input
                                type="email"
                                id="mail"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div id="imail"></div>
                        </div>
                    )}
                    <button className={styles.but} onClick={forgett}>Enter</button>
                    <Link to="/login" className={styles.back}>Back to login</Link>
                </div>
            </div>
        </div>
    );
}

export default Forget;
