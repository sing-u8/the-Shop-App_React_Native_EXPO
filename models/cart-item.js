
const CartItem =(quantity, productPrice, productTitle, sum) => {
   return {
      quantity : quantity,
      productPrice : productPrice,
      productTitle : productTitle,
      sum : sum,
   }
}
export default CartItem;