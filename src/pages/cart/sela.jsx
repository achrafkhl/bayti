import styles from './cart.module.css';
function Sela({ cart, onClick }) {
    return (
      <div className={styles.sela}>
        <div className={styles.product}>
          <img src={cart.url} alt={cart.product} />
          <p>{cart.product}</p>
        </div>
        <div className={styles.info}>
          <p>{cart.price} DA</p>
          <p>{cart.quantity}</p>
          <p>{(cart.quantity * cart.price).toLocaleString()} DA</p>
        </div>
        <button onClick={onClick}><i className="far fa-times-circle"></i></button>
      </div>
    );
  }
  export default Sela
  