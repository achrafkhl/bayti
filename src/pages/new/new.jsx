import { useState } from "react";
import supabase from '/src/config/supabaseClient';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from "react-router-dom";
import styles from './new.module.css'
function New() {
    const [product, setProduct] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [rating, setRating] = useState('');
    const [file, setFile] = useState('');
    const [loading, setLoading] = useState(false);  // New Loading State
    const userId = localStorage.getItem("userId");

    const submitInfo = async () => {
        if (!category || !price || !description || !rating || !file || !product) {
            alert('You have to fill all the fields');
            return;
        }
        if (!userId) {
            alert("User ID not found! Please log in again.");
            return;
        }

        setLoading(true); // Start Loading

        try {
            const fileName = `${Date.now()}-${file.name}`;

            const { error: fetchError } = await supabase.storage
                .from("avatar")
                .upload(`public/${fileName}`, file, { cacheControl: "3600", upsert: false });

            if (fetchError) {
                console.error("Upload error:", fetchError.message);
                setLoading(false);
                return;
            }

            const { data } = supabase.storage.from("avatar").getPublicUrl(`public/${fileName}`);
            const publicUrl = data.publicUrl;

            const { data: nameData, error: nameError } = await supabase.from("users").select("*").eq("id", userId).single();

            if (nameError) {
                console.error(nameError);
                setLoading(false);
                return;
            }

            const { error } = await supabase.from('seller').insert({
                sid: userId,
                product,
                name: nameData.name,
                rating,
                price,
                category,
                description,
                url: publicUrl,
            });

            if (error) {
                console.log('Error inserting data:', error);
                setLoading(false);
                return;
            }

            
            window.location.href = "/meal";
        } catch (error) {
            console.error("Unexpected error:", error);
        } finally {
            setLoading(false); // Stop Loading
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <h1><em>BAYTI</em></h1>
                <ul>
                    <li><Link to="/homes"><i className="fas fa-home"></i> Home</Link></li>
                    <li style={{ backgroundColor: "grey", padding: '10px', borderRadius: "15px" }}>
                        <Link to="/new"><i className="fas fa-plus-circle"></i> New meal</Link>
                    </li>
                    <li><Link to="/meal"><i className="fas fa-utensils"></i> My meals</Link></li>
                    <li><Link to="/sprofile"><i className="fas fa-user"></i> Profile</Link></li>
                </ul>
            </div>
            
            <div className={styles.add}>
                <div className={styles.container}>
                    <h1 style={{ textAlign: 'center' }}>Add a product</h1>
                    <div className={styles.first}>
                        <input type="text" placeholder='Product name' value={product} onChange={(e) => setProduct(e.target.value)} />
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Select a category</option>
                            <option value="sweet">Sweet</option>
                            <option value="traditional">Traditional</option>
                            <option value="fast food">Fast Food</option>
                            <option value="cold">Cold</option>
                        </select>
                    </div>
                    <div className={styles.first}>
                        <input type="number" placeholder='Price (DA)' value={price} onChange={(e) => setPrice(e.target.value)} />
                        <input type="text" placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className={styles.first}>
                        <input type="number" placeholder='Rating' value={rating} onChange={(e) => setRating(e.target.value)} />
                        <div className={`${styles.custom_file_upload} ${styles.ana}`}>
                            <label htmlFor="file-upload" className={styles.file_label}>
                                Enter a photo <i className="fas fa-image"></i>
                            </label>
                            <input id="file-upload" type="file" onChange={(e) => setFile(e.target.files[0])} />
                            {file && <p className={styles.file_name}>{file.name}</p>}
                        </div>
                    </div>
    
                    {/* Submit Button with Loading Spinner */}
                    <button onClick={submitInfo} disabled={loading}>
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
    
}

export default New;
