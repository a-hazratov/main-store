import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { gql } from "apollo-boost";
import {graphql} from 'react-apollo';
import './HeaderStyle.css'
import CartItem from './CartItem'
import Cart from './SVG/cart.svg'
import Close from './SVG/close-sign.svg'


const getProducts = gql`
{
    category {
        products {
            id
            name
            inStock
            gallery   
            category  
            description
            attributes{
                name
                items{
                    displayValue
                    value
                }
            } 
            prices  {
                currency
                amount
            }    
        }
    }
}
`
 class Header extends Component {
   constructor(props) {
       super(props)
       
       this.currency = this.props.currency;
       this.cart = 'cart';
       this.state = {
           isOpen: false,
           cart: JSON.parse(localStorage.getItem(this.cart)),
           products: [],
           key: new Date()   
       }
   }


 

   componentDidMount() {
        try {
         setTimeout(() => {
            this.setState({
               products: [...this.props.data.category.products]
            })
             this.getDataFromStorage()
        
        }, 1000)
        }
        catch(error) {
          console.log("This is error "+ error)
       }
    
    }



    toggleCart=()=> {
        let cart = document.querySelector('.cart-small');
        if(this.state.isOpen === false) {
            cart.style.display = "block";
            this.setState({
                isOpen: true,
                cart: []
            })
        } else if (this.state.isOpen === true) {
            cart.style.display = "none";
            this.setState({
                isOpen: false
            })
        }
        this.getDataFromStorage()  
    }

    
  
    getDataFromStorage=()=> {  
        if(localStorage[this.cart]) {
            this.setState({
                cart: JSON.parse(localStorage.getItem(this.cart))
            })
        } 
    }
 
   // Remove shopping items from local storage when checkout button is clicked
    removeFromStorage=()=> {
        localStorage.removeItem(this.cart)
        this.toggleCart()
        let counter = document.querySelector(".counter");
        let smallCartCounter = document.querySelector(".smallCartCounter");
        counter.textContent = "0";
        smallCartCounter.textContent = "";
    }


    render() {
      let getData = this.getDataFromStorage;
      let numOfItems = this.props.numberOfItems
      let products = this.state.products;
      let key = this.state.key.getTime();
      let currency = this.props.currency;
      let cart = this.state.cart;

      // Display total price in the small shopping cart
      function displayTotal() {
        let currentCurrency = currency;
        let currentCart = cart;
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
         return [currentCurrency,"   ", total.toFixed(2)]
       }

      if(!products) {
          return ( <div className = "header"></div>)
      }
       
      return (
           
            <div>
                <div className="header">
                    <nav className = "header__navbar">
                       <div className="header__navbar__category">
                           <div className="header__navbar__category__item">
                               <Link to="/">ALL ITEMS</Link>
                           </div>
                           <div className="header__navbar__category__item">
                               <Link to="/clothes">CLOTHES</Link>
                            </div>
                            <div className="header__navbar__category__item">
                                <Link to="/tech">TECH</Link>
                            </div>                          
                        </div>

                         <div className = "header__navbar__bag">
                             <Link to = "/"><img src="https://icons.iconarchive.com/icons/petalart/free-shopping/48/shopping-bag-icon.png" alt="Shopping bag"/></Link>
                         </div>

                         <div className = "header__navbar__links">
                                <div className="header__navbar__links__currency">
                                  <select name="currency" id="currency" onChange={this.props.setCurrency}>
                                     <option value="USD">USD</option>
                                     <option value="GBP">GBP</option>
                                     <option value="AUD">AUD</option>
                                     <option value="JPY">JPY</option>
                                     <option value="RUB">RUB</option>
                                   </select>   
                               </div>

                            
                                <div className ="header__navbar__links__cartLogo">
                                    <img src= {Cart} alt="Shopping cart" onClick={this.toggleCart}></img>
                                    <span className="counter">0</span>
                                </div>
                                <div className = "cart-small" >
                                
                                        <div className = "cart-content">
                                           <h3>My Bag <span className="smallCartCounter"></span></h3>
                                           <span className = "cart-content__close" onClick = {this.toggleCart}><img src = {Close} alt="close icon"></img></span>
                                           {this.state.cart && this.state.cart.map(function(item) { 
                                              return <CartItem key={key} item={item} id = {item.id} currency = {currency} getData = {getData} numOfItems = {numOfItems}/>
                                           })} {!this.state.cart && (<p>Your cart is empty</p>) }
                                            
                                            <p className = "total">Total  <span>{displayTotal()}</span></p>

                                            <div className = "cart-content__button">
                                               <Link to = '/shopping-cart'>
                                               <button type="button" onClick = {this.toggleCart}>VIEW BAG</button>
                                               </Link>
                                               <Link to = '/'>
                                               <button type="button" className= "checkOut" onClick={this.removeFromStorage}>CHECK OUT</button>
                                               </Link>
                                            </div>
                                        </div>    
                                </div>                      
                         </div>
                    </nav>
                </div>
            </div>
        )
       
    }
}

export default graphql(getProducts)(Header);

