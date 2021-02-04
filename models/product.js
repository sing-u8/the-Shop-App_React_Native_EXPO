
const Product = (id, ownerId, title, imageUrl, description, price)=>{
    return {
        id : id,
        ownerId : ownerId,
        title : title,
        imageUrl : imageUrl,
        description : description,
        price : price,
    }
}
export default Product;