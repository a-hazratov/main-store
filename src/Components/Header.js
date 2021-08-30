import React, { PureComponent } from 'react'
import {Link} from 'react-router-dom'
import { gql } from "apollo-boost";
import {graphql} from 'react-apollo';
import './ComStyles/HeaderStyle.css'
import CartItem from './CartItem'
import Cart from './SVG/cart.svg'
import Close from './SVG/close-sign.svg'
import Dollar from './SVG/dollar-sign.svg'
import AusDollar from './SVG/dollar-sign.svg'
import Pound from './SVG/pound-sign.svg';
import Yen from './SVG/yen-sign.svg'
import Ruble from './SVG/ruble-sign.svg'
import DownArrow from './SVG/down-arrow.svg'
import UpArrow from './SVG/up-arrow.svg'


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
 class Header extends PureComponent {
   constructor(props) {
       super(props)
       this.cartSmall = React.createRef();
       this.cartSmallInner = React.createRef();
       this.cartIcon = React.createRef();
       this.headerMain = React.createRef();
       this.currencyButton = React.createRef();
       this.currencySelect = React.createRef();
       this.arrow = React.createRef();
       this.currencyBox = React.createRef()
        this.cart = 'cart';
       this.state = {
           isOpen: false,
           cart: JSON.parse(localStorage.getItem(this.cart)),
           products: [],  
           arrowImg: DownArrow,
           moneyBoxOpen : true,
           moneySign: Dollar,
           currencySign: {
               USD : Dollar,
               RUB : Ruble,
               JPY : Yen,
               GBP : Pound,
               AUD : AusDollar
           }
       }
   }

  

   componentDidMount() {
      document.addEventListener('mousedown', this.currencyBoxOutside)

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

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.currencyBoxOutside)
    }
    
    //Handle the click outside of currency dropdown
    currencyBoxOutside=(event)=>{
        if(this.currencyBox.current && !this.currencyBox.current.contains(event.target) && !this.state.moneyBoxOpen === true) {
               this.toggleCurrency()
        
        }
    }

    // Close the small cart overlay when the click occures outside the cart 
    handleClickOutside=()=>{
       this.headerMain.current.addEventListener('click', (event)=> {
           if(this.state.isOpen && !this.cartSmallInner.current.contains(event.target)) {
               this.toggleCart()
           }
       })
       
    }
  
    
    toggleCart=()=> {
            if(this.state.isOpen === false) {
                this.cartSmall.current.style.display = "block";
                this.setState({
                    isOpen: true,
                    cart: []
                })
    
    
            } else if (this.state.isOpen === true) {
                this.cartSmall.current.style.display = "none";
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

    
    //Toggle currency button
    toggleCurrency=()=>{
       let select = this.currencySelect.current;
       //select.classList.toggle('hiddenCurrency');
       if(this.state.moneyBoxOpen === false) {
           select.classList.add("hiddenCurrency")
           this.setState({
               arrowImg: DownArrow,
               moneyBoxOpen: true
           })
       }else if(this.state.moneyBoxOpen === true) {
           select.classList.remove('hiddenCurrency')
           this.setState({
            arrowImg: UpArrow,
            moneyBoxOpen: false
        })
       }
    }

    //Select currency from the dropdown
    selectCurrency=()=>{
        let currencyBox = this.currencySelect.current;
        let currencyItems = this.state.currencySign;
        
        currencyBox.addEventListener('click', (event)=>{
            
            if(event.target.tagName === "INPUT" || "LABEL" ) {

                for(let symbol in currencyItems) {
                    if(symbol === event.target.value) {
                        this.setState({
                            moneySign: currencyItems[symbol]
                        })
                    }
                }

               this.props.setCurrency(event.target.value)
               this.toggleCurrency()
            }
        })
      
    }


    render() {
      let arrowSrc = this.state.arrowImg;
      let moneySign = this.state.moneySign;
      let getData = this.getDataFromStorage;
      let numOfItems = this.props.numberOfItems
      let products = this.state.products;
      let cart = this.state.cart;
      let currency = this.props.currency;
      

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
         return [total.toFixed(2)]
       }

      if(!products) {
          return ( <div className = "header"></div>)
      }
       
      return (
           
            <div>
                <div className="header" >
                    <nav className = "header__navbar" ref={this.headerMain} onClick = {this.handleClickOutside}>
                       <div className="header__navbar__category">
                           <div className="header__navbar__category__item">
                               <Link to="/">ALL ITEMS</Link>
                           </div>
                            {this.props.categories.map((each)=>(
                                 <div className="header__navbar__category__item" id={each.name}>
                                    <Link to= {`/${each.name}`}  onClick={this.props.categoryClick}>{each.name.toUpperCase()}</Link>
                                 </div>
                            ))}

                                                
                        </div>

                         <div className = "header__navbar__bag">
                             <Link to = "/"><img src="https://icons.iconarchive.com/icons/petalart/free-shopping/48/shopping-bag-icon.png" alt="Shopping bag"/></Link>
                         </div>

                         <div className = "header__navbar__links">
                                <div className="header__navbar__links__currency" ref={this.currencyBox} >
                                    <button className = "currency-button" id = "currency-button" ref={this.currencyButton} onClick={this.toggleCurrency}>
                                        <img src = {moneySign} alt="USD"></img> 
                                        <img className = "arrow" src = {arrowSrc} alt="downArrow"></img>
                                    </button>
                                   <div className = "select hiddenCurrency" ref = {this.currencySelect} onClick = {this.selectCurrency}>
                                       <label className = "select-option" for="USD">&#36; USD</label>
                                       <input className = "select-item" id="USD" type="radio" name="currency" value="USD"/>

                                       <label className = "select-option" for="GBP">&#163; GBP</label>
                                       <input className = "select-item" id="GBP" type="radio" name="currency" value="GBP"/>

                                       <label className = "select-option" for="AUD">&#36; AUD</label>
                                       <input className = "select-item" id="AUD" type="radio" name="currency" value="AUD"/>

                                       <label className = "select-option" for="JPY">&#165;  JPY</label>
                                       <input className = "select-item" id="JPY" type="radio" name="currency" value="JPY"/>

                                       <label className = "select-option" for="RUB">&#8381; RUB</label>
                                       <input className = "select-item" id="RUB" type="radio" name="currency" value="RUB"/>

                                   </div>
                               </div>

                            
                                <div className ="header__navbar__links__cartLogo">
                                    <img src= {Cart} alt="Shopping cart" onClick={this.toggleCart} ref={this.cartIcon}></img>
                                    <span className="counter">0</span>
                                </div>
                                <div className = "cart-small" ref={this.cartSmall}>
                                
                                        <div className = "cart-content" ref = {this.cartSmallInner}>
                                           <h3>My Bag <span className="smallCartCounter"></span></h3>
                                           <span className = "cart-content__close" onClick = {this.toggleCart}><img src = {Close} alt="close icon"></img></span>
                                           {this.state.cart && this.state.cart.map(function(item) { 
                                              return <CartItem key={item.id+item.uKey} item={item} id = {item.id} 
                                                        currency = {currency} getData = {getData}
                                                         numOfItems = {numOfItems} moneySign = {moneySign}/>
                                           })} {!this.state.cart && (<p>Your cart is empty</p>) }
                                            
                                            <p className = "total">Total  <span><img src = {moneySign} alt="money"></img>{displayTotal()}</span></p>

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


/**<ul name="currency" id="currency" ref = {this.props.select} onChange={this.props.setCurrency}>
                                     <li className = "selectItem" value="USD">USD</li>
                                     <li className = "selectItem"  value="GBP">GBP</li>
                                     <li className = "selectItem" value="AUD">AUD</li>
                                     <li className = "selectItem" value="JPY">JPY</li>
                                     <li className = "selectItem" value="RUB">RUB</li>
                                   </ul>    */

/**<div className="header__navbar__category__item">
                               <Link to="/clothes">CLOTHES</Link>
                            </div>
                            <div className="header__navbar__category__item">
                                <Link to="/tech">TECH</Link>
                            </div>      */