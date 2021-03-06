import React, { PureComponent } from 'react';
import {Link} from 'react-router-dom'
import styles from './bigCart.module.css';
import BigCartItem from '../bigcartitem';


 class BigCart extends PureComponent {
      constructor(props) {
          super(props);
          this.cart = "cart";
          this.currencySign= {
            USD : '\u0024',
            RUB : '\u20BD',
            JPY : '\u00A5',
            GBP : '\u00A3',
            AUD : '\u0024'
          }
          this.state = {
              cart: [],
              updatedSmallCart: false
          }
      }

      componentDidMount(){
          this.getDataFromStorage()
      }

      getDataFromStorage=()=> {  
        if(localStorage[this.cart]) {
            this.setState({
                cart: JSON.parse(localStorage.getItem(this.cart))
            })
        } 
      }

    //Remove items from storage when checkout button is clicked
    removeFromStorage=()=> {
        localStorage.removeItem(this.cart);
        this.props.numberOfItems(null)
    }
    


     // Display total price in the shopping cart
    displayTotal=()=> {
      let currentCurrency = this.props.currency;
      let currentCart = this.state.cart;
      let total = 0;
       currentCart.map((each) => each.prices.forEach(price => {
          if(currentCurrency === price.currency) {
            total = total + (price.amount * each.quantity)
          }
       }))
      return (<span>{this.currencySign[currentCurrency]}  {total.toFixed(2)}</span>)
   }


    render() {
        let cart = this.state.cart;
        let getData = this.getDataFromStorage;
        let currency = this.props.currency;
        let numOfItems = this.props.numberOfItems;
                
        
        return (
          <div className = {styles.main_cart_container}> 
            <div className ={styles.main_cart}>
                <div className = {styles.main_cart__name}>
                   <h2>Cart</h2>
                </div>
                {cart && cart.map(function(item) { 
                   return <BigCartItem item={item} key = {item.uKey} id={item.id} 
                    currency = {currency}
                    getData = {getData} numOfItems = {numOfItems}/>
                })}
                  
                  <div className = {styles.bigCartTotal}>
                     <p>Total:  {this.displayTotal()}  </p>
                  </div>
                 <div className = {styles.bigCart_content__button}>
                   <Link to = '/'>
                      <button type="button" className= {styles.bigCheckOut} onClick = {this.removeFromStorage}>CHECK OUT</button>
                   </Link>
                 </div>                            
            
            </div>
          </div>  
        )
    }
}

export default BigCart
