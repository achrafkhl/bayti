import { useState } from "react";
import supabase from "/src/config/supabaseClient";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from "react-router-dom";
import styles from './signup.module.css'
function Signup() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [conf, setConf] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [age, setAge] = useState("");
  const [lname, setLname] = useState("");
  const [fname, setFname] = useState("");
  const [sign, setSign] = useState(true);
  const [cont, setCont] = useState(false);

  const removeError = (id) => {
    const errorElement = document.getElementById(id);
    if (errorElement) errorElement.remove();
  };

  const showError = (parentId, errorId, message, inputId) => {
    removeError(errorId);
    const parent = document.getElementById(parentId);
    const error = document.createElement("p");
    error.innerText = message;
    error.style.color = "red";
    error.id = errorId;
    parent.appendChild(error);
    document.getElementById(inputId).style.border = "solid 2px red";
  };

  const resetBorders = () => {
    document.getElementById("sign-mail").style.border = "solid 2px grey";
    document.getElementById("sign-tele").style.border = "solid 2px grey";
    document.getElementById("sign-pass").style.border = "solid 2px grey";
  };

  const handleSignUp = async () => {
    resetBorders();
    removeError("err-mail");
    removeError("err-phone");
    removeError("err-pass");

    if (!email || !phone || !pass || !conf) {
      alert("You need to fill all the fields");
      return;
    }

    if (pass !== conf) {
      showError("tell", "err-pass", "Passwords do not match", "sign-pass");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("email, phone")
      .or(`email.eq.${email},phone.eq.${phone}`)
      .single();

    if (data||!error) {
      if (data.email === email) showError("imail", "err-mail", "Email already registered", "sign-mail");
      if (data.phone === phone) showError("passw", "err-phone", "Phone number already registered", "sign-tele");
      return;
    }

    setCont(true);
    setSign(false);
  };

  const finishSignUp = async () => {
    removeError("err-name");
    document.getElementById("sign-name").style.border = "solid 2px grey";

    if (!name || !age || !fname || !lname || !role) {
      alert("You need to fill all the fields");
      return;
    }

    const { data:userData, error } = await supabase.from("users").select("name").eq("name", name.toLowerCase()).single();

    if (userData||!error) {
      showError("passw", "err-name", "Username already registered", "sign-name");
      return;
    }
    const { data,error: signUpError } = await supabase.auth.signUp({
      email,
      password: pass,
    });

    if (signUpError) {
      console.log('signup error');
      setCont(false);
      setSign(true);
    }
    const userId = data.user?.id;
    const { error: insertError } = await supabase.from("users").insert([
      { id:userId,email, phone, name, fname, lname, age, type:role,}
    ]);

    if (insertError) {
      alert("Error creating account!");
      return;
    }

    alert("Sign-up successful! Check your email for verification.");
    window.location.href = "/login";
  };
  const back = () => {
    setCont(false);
      setSign(true);
  }
  return (
    <div className={styles.body}>
      <div className={styles.c1}></div>
      <div className={styles.c2}></div>
      <div className={styles.c3}></div>
      <div className={styles.c4}></div>
      <div className={styles.c5}></div>
  
      {sign && (
        <div className={styles.login}>
          <div className={styles.ii} style={{ textAlign: "left", marginLeft: "20px" }}>
            <Link to="/" style={{ cursor: "pointer" }}>
              <i className="fas fa-home" style={{ color: "black" }}></i>
            </Link>
          </div>
          <h1>Sign Up</h1>
  
          <div className={styles.email}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" id="sign-mail" required />
            <i className="fa fa-envelope"></i>
          </div>
          <div id="imail"></div>
  
          <div className={styles.phone}>
            <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" id="sign-tele" required />
            <i className="fas fa-phone"></i>
          </div>
          <div id="passw"></div>
  
          <div className={styles.pass}>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Enter your password" id="sign-pass" required />
            <i className="fas fa-lock"></i>
          </div>
          <div id="tell"></div>
  
          <div className={styles.conf}>
            <input type="password" value={conf} onChange={(e) => setConf(e.target.value)} placeholder="Confirm password" id="sign-conf" required />
          </div>
  
          <div className={styles.footer}>
            <button onClick={handleSignUp}>Continue</button>
          </div>
  
          <p>Already have an account? <Link to="/login"><strong>Login</strong></Link></p>
        </div>
      )}
  
      {cont && (
        <div className={styles.continue}>
          <div className={styles.ii} style={{ textAlign: "left", marginLeft: "20px" }}>
            <i className="fas fa-arrow-left" style={{ color: "black", cursor: "pointer", fontSize: "20px" }} onClick={back}></i>
          </div>
          <h1>Set up your account <i className="fas fa-cog"></i></h1>
  
          <div className={styles.grid}>
            <input type="text" placeholder="First name" value={fname} onChange={(e) => setFname(e.target.value)} />
            <input type="text" placeholder="Last name" value={lname} onChange={(e) => setLname(e.target.value)} />
            <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="" style={{ color: "gray" }}>Select a role</option>
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
            </select>
            <input type="text" placeholder="Username" id="sign-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div id="passw"></div>
          <button onClick={finishSignUp}>Continue</button>
        </div>
      )}
    </div>
  );
  
}

export default Signup;
