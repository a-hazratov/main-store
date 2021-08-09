import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import './BigCartStyle.css';
import BigCartItem from '../Components/BigCartItem';

 class BigCart extends Component {
      constructor(props) {
          super(props);
          this.cart = "cart";
          this.state = {
              cart: [],
              currency: "GBP"
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
        let counter = document.querySelector(".counter");
        let smallCartCounter = document.querySelector(".smallCartCounter");
        counter.textContent = "0";
        smallCartCounter.textContent = "";
    }

    // Display total price in the small shopping cart
    displayTotal=()=> {
        let currentCurrency = this.state.currency;
        let currentCart = this.state.cart;
        let total = 0;
        if(currentCart) {
         for(let i = 0; i < currentCart.length; i++) {
           for(let j =0; j < currentCart[i].prices.length; j++) {
               if(currentCurrency === currentCart[i].prices[j].currency) {
                   total = total + (currentCart[i].prices[j].amount * currentCart[i].quantity )
               }
           }
         }
        }
         return [currentCurrency, total.toFixed(2)]
    }


    render() {
        let cart = this.state.cart;
        let getData = this.getDataFromStorage
        let currency = this.state.currency
        console.log("Big cart contents " + cart)
        return (
          <div className = "main-cart-container"> 
            <div className ="main-cart">
                <div className = "main-cart__name">
                <h2>Cart</h2>
                </div>
                {cart && cart.map(function(item) { 
                return <BigCartItem item={item} id={item.id} currency = {currency} getData = {getData}/>
                })}
                  
                  <div className = "bigCartTotal">
                  <p >Total  <span>{this.displayTotal()}</span></p>
                  </div>
                 <div className = "bigCart-content__button">
                  <Link to = '/'>
                   <button type="button" className= "bigCheckOut" onClick = {this.removeFromStorage}>CHECK OUT</button>
                  </Link>
                 </div>                            
            
            </div>
          </div>  
        )
    }
}

export default BigCart

