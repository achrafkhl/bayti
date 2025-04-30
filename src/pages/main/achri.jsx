import { useState, useEffect } from 'react';
import styles from './achri.module.css';
import supabase from '/src/config/supabaseClient';
import { Link } from 'react-router-dom';
import image from '../../assets/9f56d93485bb138397711744476d8c46.png';
import image1 from '../../../public/bayti2.png';
function Achri() {
    const [topMeals, setTopMeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopMeals = async () => {
            const { data, error } = await supabase
                .from('seller')
                .select('*')
                .order('rating', { ascending: false })
                .limit(3);

            if (error) {
                console.error('Error fetching top meals:', error);
            } else {
                setTopMeals(data);
            }
            setLoading(false);
        };

        fetchTopMeals();
    }, []);

    return (
        <div className={styles.main_container}>
            <div className={styles.header}>
                <div className={styles.logo}>
                    <img src={image1} alt="bayti" />
                </div>
                <nav className={styles.nav}>
                    <ul className={styles.nav_list}>
                        <li><Link className={styles.nav_link} to="/">Home</Link></li>
                        <li><Link className={styles.nav_link} to="/login">Login</Link></li>
                        <li><Link className={styles.nav_link} to="/signup">Sign Up</Link></li>
                        <li><Link className={styles.nav_link} to="/">Info</Link></li>
                    </ul>
                </nav>
            </div>

            <main>
                <section className={styles.hero_section}>
                    <div className={styles.hero_content}>
                        <h1>Welcome to <span className={styles.highlight}>BAYTI</span></h1>
                        <p>Your one-stop destination for delicious meals. Order from the best restaurants and enjoy fast delivery right to your doorstep.</p>
                        <div className={styles.hero_buttons}>
                            <Link to="/login" className={`${styles.cta_button} ${styles.primary}`}>Order Now <i className="fas fa-arrow-right"></i></Link>
                            <Link to="/signup" className={`${styles.cta_button} ${styles.secondary}`}>Get a Taste <i className="fas fa-user-plus"></i></Link>
                        </div>
                    </div>
                    <div className={styles.hero_image}>
                        <div className={styles.image_container}>
                            <img src={image} alt="Delicious food" />
                            <div className={styles.image_overlay}></div>
                        </div>
                    </div>
                </section>

                <section className={styles.features}>
                    <h2 className={styles.section_title}>Why Choose Us</h2>
                    <div className={styles.features_grid}>
                        <div className={styles.feature_card}>
                            <div className={styles.feature_icon}>
                                <i className="fas fa-truck"></i>
                            </div>
                            <h3>Fast Delivery</h3>
                            <p>Get your favorite meals delivered in no time with our efficient delivery service.</p>
                        </div>
                        <div className={styles.feature_card}>
                            <div className={styles.feature_icon}>
                                <i className="fas fa-star"></i>
                            </div>
                            <h3>Quality Food</h3>
                            <p>Enjoy the best quality meals prepared by our professional chefs.</p>
                        </div>
                        <div className={styles.feature_card}>
                            <div className={styles.feature_icon}>
                                <i className="fas fa-fire"></i>
                            </div>
                            <h3>Hot & Fresh</h3>
                            <p>Your meals arrive hot and fresh, just like they came out of the kitchen.</p>
                        </div>
                    </div>
                </section>

                <section className={styles.testimonials}>
                    <h2 className={styles.section_title}>Our Best Meals</h2>
                    <div className={styles.testimonials_grid}>
                        {loading ? (
                            <div className={styles.loading}>Loading top meals...</div>
                        ) : topMeals.length > 0 ? (
                            topMeals.map((meal) => (
                                <div className={styles.testimonial_card} key={meal.id}>
                                    <div className={styles.meal_image}>
                                        <img src={meal.url} alt={meal.product} />
                                    </div>
                                    <div className={styles.testimonial_content}>
                                        <div className={styles.meal_rating}>
                                            {[...Array(meal.rating)].map((_, i) => (
                                                <i key={i} className="fas fa-star"></i>
                                            ))}
                                        </div>
                                        <h3>{meal.product}</h3>
                                        <div className={styles.meal_category}>
                                            <i className="fas fa-tag"></i> {meal.category}
                                        </div>
                                        <div className={styles.meal_price}>{meal.price} DA</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.no_meals}>No top meals found</div>
                        )}
                    </div>
                </section>

                <section className={styles.cta_section}>
                    <h2>Ready to Get Started?</h2>
                    <p>Get a taste of something better</p>
                    <Link to="/signup" className={`${styles.cta_button} ${styles.primary}`}>Sign Up Now</Link>
                </section>
            </main>
        </div>
    );
}

export default Achri;
