import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { gql } from "apollo-boost";
import {graphql} from 'react-apollo';
import './HeaderStyle.css'
import CartItem from './CartItem'
import Dollar from './SVG/dollar-sign.svg'
import DownArrow from './SVG/down-arrow.svg'
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
       
       
       this.cart = 'cart';
       this.state = {
           isOpen: false,
           cart: JSON.parse(localStorage.getItem(this.cart)),
           currency: "USD",
           products: [],
           key: new Date(),
           
       }
   }


 

componentDidMount() {
     try {
        console.log("Header Mounted with componentDidMount");
         setTimeout(() => {
        console.log("Data for Header is fetched", this.props.data.category.products);
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
 
   
    
    getItemFromApi=(id)=> {
        let product = this.state.products.find(each => each.id === id)
        return product
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
      let getData = this.getDataFromStorage;
      console.log("The total amount of money", this.displayTotal())
      let products = this.state.products;
      let key = this.state.key.getTime();
      let currency = this.state.currency;
      if(!products) {
          return (
              <div className = "header"></div>        
          )
         
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
                                    <img src= {Dollar} alt="dollar sign"/>
                                    <img src= {DownArrow}  alt="Dropdown arrow"/>
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
                                           return <CartItem key={key} item={item} id = {item.id} currency = {currency} getData = {getData}/>
                                         })} {!this.state.cart && (<p>Your cart is empty</p>) }
                                            
                                            <p className = "total">Total  <span>{this.displayTotal()}</span></p>

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

