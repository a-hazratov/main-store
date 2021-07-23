import React, { Component } from 'react'
import './CartItemStyle.css'
import Plus from './SVG/plus-square.svg'
import Minus from './SVG/minus-square.svg'

 export default class CartItem extends Component {
    constructor(props) {
        super(props);
       
        this.state = {
         
        }
    }


    render() {
       
        return (
            
            <div className = "cartItem">
                <div className = "cartItem__name">
                    
                      <div className="col1">
                          <h5>{this.props.item.name}</h5>
                          <h6>Very good shirt</h6>
                           <p>$50</p>
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
                         Photo here
                      </div>
                    
                  </div>

                  <div>
                    
                </div>
            </div>
        )
    }
}

