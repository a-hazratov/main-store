import React, { Component } from 'react'
import { gql } from "apollo-boost";
import {graphql} from 'react-apollo';
import './CartItemStyle.css'
import Plus from './SVG/plus-square.svg'
import Minus from './SVG/minus-square.svg'

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

 class CartItem extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
         products: this.props.products
         
        }
       
    }

    
        
    render() {
            console.log("Products in CartItem ", this.state.products)
            console.log("This is a product from Header to CartItem ", this.props.product )
        return (
            
            <div className = "cartItem">
                <div className = "cartItem__name">
                    
                      <div className="col1">
                          <h5>{this.props.item.name}</h5>
                          
                           <p className = "cartItem__price">${this.props.product.prices[0].amount}</p>
                           <ul>
                               <li>L</li>
                               <li>XL</li>
                           </ul>
                      </div>
                      <div className="col2">
                          <span><img src = {Plus} alt="increment"></img></span>
                           <span>{this.props.item.quantity}</span>
                           <span><img src = {Minus} alt="decrement"></img></span>
                      </div>
                      <div className="col3">
                         <img src = {this.props.product.gallery[0]} alt= "sale item"></img>
                      </div>
                    
                  </div>

                  <div>
                    
                </div>
            </div>
        )
    }
}

export default graphql(getProducts)(CartItem);
