import dayjs from 'dayjs'

const Order = (id, items, totalAmount, date) => {
   return {
      id, 
      items, 
      totalAmount, 
      date,
      get readableDate() {
         return dayjs(this.date).format('MMM DD YYYY, HH:mm A')
      }
   }
}

export default Order
