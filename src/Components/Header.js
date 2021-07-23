import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { gql } from "apollo-boost";
import {graphql} from 'react-apollo';
import './HeaderStyle.css'
import CartItem from './CartItem'
import Dollar from './SVG/dollar-sign.svg'
import DownArrow from './SVG/down-arrow.svg'
import Cart from './SVG/cart.svg'

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
           cart: []
       }
   }

/*
   componentDidMount() {
    console.log("Mounted Header");
    setTimeout(() => {
        console.log("Data is fetched");
        this.setState({
           // products: [...this.props.data.category.products],
            cart: JSON.parse(localStorage[this.cart])
        })
    }, 1000)
}*/

    toggleCart=()=> {
        let cart = document.querySelector('.cart-small');
        if(this.state.isOpen === false) {
            cart.style.display = "block";
            this.setState({
                isOpen: true
            })
        } else if (this.state.isOpen === true) {
            cart.style.display = "none";
            this.setState({
                isOpen: false
            })
        }  
    }

    getDataFromStorage=()=> {
        let products = localStorage.getItem(this.cart)
        if(localStorage[this.cart]) {
            this.setState({
                cart: JSON.parse(products)
            })
        }
    }

    componentDidMount() {
        this.getDataFromStorage()
    }

    render() {
      console.log(this.state.cart)
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
                                      <h3>My Bag <span>items</span></h3>
                                        {this.state.cart !== 0 ? this.state.cart.map(function(item) { 
                                            return <CartItem item={item}/>
                                         }):<p>You cart is empty</p>}
                                            
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

