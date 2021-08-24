import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './ComStyles/SaleItemStyle.css';
import Cart from './SVG/emptyCart.png';


export default class SaleItem extends Component {
    constructor (props) {
        super(props);
        this.productCard = React.createRef()
        this.cartGreen = React.createRef()
        this.layer = React.createRef()
        this.state = {
           hovered: false
        }
       
    }
   
    outOfStock=()=>{
        if(!this.props.inStock) {
            return (<div className = "outOfStockLayer"><p>out of stock</p></div>)
        }
    }
    // Display the price in the product card
    displayPrice=()=> {
      
        let currentCurrency = this.props.currency;
        let currentCart = this.props.item;
        let price = currentCart.prices.map((each) => {
            if(each.currency === currentCurrency) {
                return each.amount
            }
        })
        
         return [currentCurrency, price]
    }

    //add to cart when the round green cart is clicked
      addItemToCart=(e)=>{
          e.preventDefault()
          console.log("The green cart is clicked" + e.target)
      }



    render() { 

        return (
            <div className = "productCard" 
                  onMouseOver={()=>this.setState({hovered:true})}
                  onMouseOut={()=>this.setState({hovered:false})}>
               {this.outOfStock()}
                <Link to = {`/product/${this.props.item.id}`} >
                    <div>
                        <img src = {this.props.item.gallery[0]} alt = "sale product"/>
                        {this.props.item.inStock ? (
                            <div className = "roundCart" style={{display: `${this.state.hovered ? "block" : "none"}`}}
                            ref={this.cartGreen} onClick={this.addItemToCart} >
                           <img src = {Cart} alt = "small cart" />
                        </div>
                        ) : null}
                        

                    </div>

                    <div className = "productCard__bottom">
                        <p>{this.props.item.name}</p>
                        <p style = {{fontFamily: "Raleway"}}>{this.displayPrice()}</p>
                    </div>
                </Link>
                
            </div>
        )
    }
}

/**<div className = "roundCart" style={{display: `${this.state.hovered ? "block" : "none"}`}}
                             ref={this.cartGreen} >
                            <img src = {Cart} alt = "small cart" />
                         </div> */