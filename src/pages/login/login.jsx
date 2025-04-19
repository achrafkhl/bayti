import { useState } from "react";
import supabase from '/src/config/supabaseClient'
import styles from './Login.module.css'
import { Link,useNavigate } from "react-router-dom";


function Login() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const navigate = useNavigate();
            const checkEmail=async(email)=>{
                const {data,error}= await supabase.from('users').select('email').eq("email",email).single()
                    if(error || !data) {
                        return false
                        }
                        return true

                    }
                    const loginn = async () => {
                        
                        const emailError = document.getElementById("err-mail");
                        const passError = document.getElementById("err-pass");
                        document.getElementById('login-mail').style.border="solid 2px grey";
                        document.getElementById('login-pass').style.border="solid 2px grey";
                        if (emailError) emailError.remove();
                        if (passError) passError.remove();
                      
                        
                        if (!email || !pass) {
                          alert("Please enter both email/phone and password.");
                          return;
                        }
                      
                        let id = email;
                      
                        
                        if (!isNaN(email)) {  
                          const { data, error } = await supabase
                            .from("users")
                            .select("email")
                            .eq("phone", id)
                            .single();
                      
                          if (error || !data) {
                            let par = document.getElementById("imail");
                        let err = document.createElement("p");
                        par.appendChild(err);
                        err.innerHTML="incorrect email or phone number"
                        err.style.color="red";
                        err.id="err-mail";
                        document.getElementById('login-mail').style.border="solid 2px red";
                            return;
                          }
                          id = data.email; 
                        }

                        const emailExists = await checkEmail(id);
                        if (!emailExists) {
                            let par = document.getElementById("imail");
                            let err = document.createElement("p");
                            par.appendChild(err);
                            err.innerHTML="incorrect email or phone number"
                            err.style.color="red";
                            err.id="err-mail";
                            document.getElementById('login-mail').style.border="solid 2px red";
                                return;
                        }
                      
                        const { data, error } = await supabase.auth.signInWithPassword({
                          email: id,
                          password: pass,
                        });
                        
                        if (error) {
                            let par = document.getElementById("passw");
                            let err = document.createElement("p");
                            par.appendChild(err);
                            err.innerHTML="incorrect password"
                            err.style.color="red";
                            err.id="err-pass";
                            document.getElementById('login-pass').style.border="solid 2px red";
                        } else {
                          const userId = data.user.id;
                          const { data: { session }, error } = await supabase.auth.getSession();
if (!error && session?.user?.id) {
  sessionStorage.setItem("userId", session.user.id);
}
                          const {data:userData, error:userError} =await supabase.from('users').select('*').eq('id',userId).single()
                          if(userError){
                            console.log(userError)
                            return
                          } else{
                            localStorage.setItem("name", userData.name);
                            if(userData.type==="seller"){
                              navigate("/homes");
                            }
                            if(userData.type==="buyer"){
                              navigate("/home");
                            }
                          
                          }
                        }
                      };
                      
                    
                      return(
                        <div className={styles.body}>
                            <div className={styles.c1}></div>
                            <div className={styles.c2}></div>
                            <div className={styles.c3}></div>
                            <div className={styles.c4}></div>
                            <div className={styles.c5}></div>
                            <div className={styles.login}>
                                <div className={styles.ii} style={{ textAlign: "left", color: "black" }}>
                                    <Link to="/" style={{ cursor: "pointer" }}>
                                        <i className="fas fa-home" style={{ color: "rgb(0, 0, 0)" }}></i>
                                    </Link>
                                </div>
                                <h1>Login</h1>
                                <div className={`${styles.email} ${styles.color}`} id="login-email">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="enter your email"
                                        id="login-mail"
                                        required
                                    />
                                    <i className="fas fa-user"></i>
                                    <div id="imail"></div>
                                </div>
                                <div className={`${styles.pass} ${styles.color}`} id="login-password">
                                    <input
                                        type="password"
                                        value={pass}
                                        onChange={(e) => setPass(e.target.value)}
                                        placeholder="enter your password"
                                        id="login-pass"
                                        required
                                    />
                                    <i className="fas fa-lock"></i>
                                </div>
                                <div id="passw"></div>
                                <div className={styles.footer}>
                                    <button id="check-btn" onClick={loginn}>Login</button>
                                    <Link to="/forget">forget password?</Link>
                                </div>
                                <p>don't have an account? <Link to="/signup"><strong>sign up</strong></Link></p>
                            </div>
                        </div>
                    );
                    
        

};
export default Login;
