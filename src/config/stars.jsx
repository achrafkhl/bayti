const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.25 && rating % 1 < 0.75; // show half star for .3, .5, etc.
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <>
            {[...Array(fullStars)].map((_, i) => (
                <i key={`full-${i}`} className="fas fa-star" style={{ color: "orange" }}></i>
            ))}
            {halfStar && <i className="fas fa-star-half-alt" style={{ color: "orange" }}></i>}
            {[...Array(emptyStars)].map((_, i) => (
                <i key={`empty-${i}`} className="far fa-star" style={{ color: "orange" }}></i>
            ))}
        </>
    );
};
export default renderStars;