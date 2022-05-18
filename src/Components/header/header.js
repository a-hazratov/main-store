import React, { PureComponent } from 'react'
import {Link} from 'react-router-dom'
import { gql } from "apollo-boost";
import {graphql} from 'react-apollo';
import styles from './header.module.css'
import CartItem from '../cartItem';
import Cart from '../SVG/cart.svg';
import Close from '../SVG/close-sign.svg';
import DownArrow from '../SVG/down-arrow.svg';
import UpArrow from '../SVG/up-arrow.svg';
import Hamburger from '../hamburger';
import appContext from '../../Context/appContext';


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
     static contextType = appContext;
   constructor(props) {
       super(props)
       this.cartSmallInner = React.createRef();
       this.currencyBox = React.createRef();
      
        this.cart = 'cart';
       this.state = {
           isOpen: false, //small shopping cart icon toggle
           cart: [],
           products: [],  
           arrowImg: DownArrow,
           moneyBoxOpen : false, //currency toggle
           moneySign: '\u0024',
           currencySign: {
            USD : '\u0024',
            RUB : '\u20BD',
            JPY : '\u00A5',
            GBP : '\u00A3',
            AUD : '\u0024'
           }
       }
   }

  

   componentDidMount() {
      document.addEventListener('mousedown', this.currencyBoxOutside)
      setTimeout(() => {
        this.setState({
            products: [...this.props.data.category.products]
         })
          this.getDataFromStorage();  
         
      }, 1000)
    }


    componentWillUnmount() {
        document.removeEventListener('mousedown', this.currencyBoxOutside);
    }
    
    //Handle the click outside of currency dropdown
    currencyBoxOutside=(event)=>{
        if(!this.currencyBox.current.contains(event.target) && this.state.moneyBoxOpen === true) {
               this.toggleCurrency()
        
        }
    }

    // Close the small cart overlay when the click occures outside the cart 
    handleClickOutside=(event)=>{
       if(this.state.isOpen && !this.cartSmallInner.current.contains(event.target)) {
        this.toggleCart()
       } 
    }
  
    
    toggleCart=()=> {
            if(this.state.isOpen === false) {
                this.setState({
                    isOpen: true,
                    cart: []
                })
            } else if (this.state.isOpen === true) {
                this.setState({
                    isOpen: false
                })
            }
            this.getDataFromStorage(); 
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
        this.props.numberOfItems(null)
    }

    
    //Toggle currency button
    toggleCurrency=()=>{
       if(this.state.moneyBoxOpen === false) {
           this.setState({
               arrowImg: UpArrow,
               moneyBoxOpen: true
           })
       }else if(this.state.moneyBoxOpen === true) {
           this.setState({
            arrowImg: DownArrow,
            moneyBoxOpen: false
        })
       }
    }

    //Select currency from the dropdown
    selectCurrency=(event)=>{
        let currencyItems = this.state.currencySign;
        let currencySymbols = Object.keys(currencyItems)
        if(event.target.tagName === "INPUT" || "LABEL" ) {
            currencySymbols.forEach((each)=> each === event.target.value ?
              this.setState({
                  moneySign: currencyItems[each],
                  moneyBoxOpen: false, //closing the currency box after selecting one currency
                  arrowImg: DownArrow    
            }) : null)
             this.props.setCurrency(event.target.value)
          }
    }

    // Display total price in the small shopping cart
     displayTotal=()=> {
        let currentCurrency = this.props.currency;
        let currentCart = this.state.cart;
        let total = 0;
        currentCart.map((each) => each.prices.forEach(price => {
            if(currentCurrency === price.currency) {
              total = total + (price.amount * each.quantity)
            }
         }))
         return [total.toFixed(2)]
       }


    render() {
      let arrowSrc = this.state.arrowImg;
      let moneySign = this.state.moneySign;
      let getData = this.getDataFromStorage;
      let numOfItems = this.props.numberOfItems
      let products = this.state.products;
     // let currency = this.props.currency;
      const { currency } = this.context.state;
      console.log(currency)
      


      if(!products) {
          return ( <div className = {styles.header}></div>)
      }
       
      return (
           
            <div>
                <div className={styles.header} >
                    <nav className = {styles.header__navbar}  onClick={(event)=>this.handleClickOutside(event)}>
                         <Hamburger/>
                         <div className = {styles.header__navbar__bag}>
                             <Link to = "/"><img src="https://icons.iconarchive.com/icons/petalart/free-shopping/48/shopping-bag-icon.png" alt="Shopping bag"/></Link>
                         </div>

                         <div className = {styles.header__navbar__links}>
                                <div className={styles.header__navbar__links__currency} ref={this.currencyBox} >
                                    <button className = {styles.currency_button} id = "currency-button" onClick={this.toggleCurrency}>
                                        <span className = {styles.moneySign_nav}> {moneySign}</span> 
                                        <img className = {styles.arrow} src = {arrowSrc} alt="downArrow"></img>
                                    </button>
                                   <div className = {!this.state.moneyBoxOpen ? `${styles.select} ${styles.hiddenCurrency}` : styles.select} 
                                        onClick = {(event)=>this.selectCurrency(event)} ref={this.currencySelect}>

                                       <label className = {styles.select_option} htmlFor="USD">&#36; USD</label>
                                       <input className = {styles.select_item} id="USD" type="radio" name="currency" value="USD"/>

                                       <label className = {styles.select_option} htmlFor="GBP">&#163; GBP</label>
                                       <input className = {styles.select_item} id="GBP" type="radio" name="currency" value="GBP"/>

                                       <label className = {styles.select_option} htmlFor="AUD">&#36; AUD</label>
                                       <input className = {styles.select_item} id="AUD" type="radio" name="currency" value="AUD"/>

                                       <label className = {styles.select_option} htmlFor="JPY">&#165;  JPY</label>
                                       <input className = {styles.select_item} id="JPY" type="radio" name="currency" value="JPY"/>

                                       <label className = {styles.select_option} htmlFor="RUB">&#8381; RUB</label>
                                       <input className = {styles.select_item} id="RUB" type="radio" name="currency" value="RUB"/>

                                   </div>
                               </div>

                            
                                <div className ={styles.header__navbar__links__cartLogo}>
                                    <img src= {Cart} alt="Shopping cart" onClick={this.toggleCart}></img>
                                    <span className={styles.counter}>{this.props.counter}</span>
                                </div>
                                <div className = {!this.state.isOpen ? `${styles.cart_small} ${styles.isClosed}` : "cart-small isOpen"}>
                                
                                        <div className = {styles.cart_content} ref = {this.cartSmallInner}>
                                           <h3>My Bag <span className={styles.smallCartCounter}>{this.props.counter} items</span></h3>
                                           <span className = {styles.cart_content__close} onClick = {this.toggleCart}><img src = {Close} alt="close icon"></img></span>
                                           {this.state.cart && this.state.cart.map(function(item) { 
                                              return <CartItem key={item.id+item.uKey} item={item} id = {item.id} 
                                                        currency = {currency} getData = {getData}
                                                         numOfItems = {numOfItems} moneySign = {moneySign}/>
                                           })} {!this.state.cart && (<p>Your cart is empty</p>) }
                                            
                                            <p className = {styles.total}>Total  <span>{moneySign} {this.displayTotal()}</span></p>

                                            <div className = {styles.cart_content__button}>
                                               <Link to = '/shopping-cart'>
                                               <button type="button" onClick = {this.toggleCart}>VIEW BAG</button>
                                               </Link>
                                               <Link to = '/'>
                                               <button type="button" className= {styles.checkOut} onClick={this.removeFromStorage}>CHECK OUT</button>
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



/**  <div className= {styles.header__navbar__category}>
                           <div className={styles.header__navbar__category__item}>
                               <Link to="/">ALL ITEMS</Link>
                           </div>
                            {this.props.categories.map((each)=>(
                                 <div className={styles.header__navbar__category__item} key={each.name} id={each.name} >
                                    <Link to= {`/${each.name}`} onClick={this.props.categoryClick}>{each.name.toUpperCase()}</Link>
                                 </div>
                            ))}

                                                
                        </div> */