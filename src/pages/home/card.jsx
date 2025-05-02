import styles from"./home.module.css"
import renderStars from "../../config/stars"
function Card({seller, onClick}) {
    
    const showCard = () => {
        document.getElementById(seller.id).style.visibility='visible'
        document.getElementById(seller.id+'d').style.visibility='visible'
    }
    const hideCard = () => {
        document.getElementById(seller.id).style.visibility='hidden'
        document.getElementById(seller.id+'d').style.visibility='hidden'
    }
    return (
    <div className={styles.card} onMouseOver={showCard} onMouseOut={hideCard} onClick={onClick}>
        <img src={seller.url} alt={seller.product} />
        <div className={styles.info}>
            <p className={styles.hide} style={{visibility:"hidden"}}id={seller.id}>{seller.name}</p>
            <p>{seller.product}</p>
            <h2>{seller.price} DA</h2>
            <div className={styles.rate}>
            {renderStars(seller.rating)}
                <p className={styles.hide} id={seller.id + 'd'} style={{ marginTop: '10px',visibility:"hidden" }}>{seller.category}</p>
            </div>
        </div>
    </div>
);

}
export default Card;