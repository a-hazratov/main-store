import React, { PureComponent } from 'react';
import {Link} from 'react-router-dom';
import './ComStyles/SaleItemStyle.css';
import Cart from './SVG/emptyCart.png';
import Dollar from './SVG/dollar-sign.svg';
import AusDollar from './SVG/dollar-sign.svg';
import Pound from './SVG/pound-sign.svg';
import Yen from './SVG/yen-sign.svg';
import Ruble from './SVG/ruble-sign.svg';


export default class SaleItem extends PureComponent {
    constructor (props) {
        super(props);
        this.cartStorage = 'cart';
        this.productCard = React.createRef();
        this.cartGreen = React.createRef();
        this.layer = React.createRef();
        this.currencySign= {
            USD : Dollar,
            RUB : Ruble,
            JPY : Yen,
            GBP : Pound,
            AUD : AusDollar
           }
        this.state = {
           hovered: false 
        }
       
    }
   
    //Places a layer on top of an item that is not in stock
    outOfStock=()=>{
        if(!this.props.inStock) {
            return (<div className = "outOfStockLayer"><p>out of stock</p></div>)
        }
    }
    // Display the price in the product card
    displayPrice=()=> {
        let currentCurrency = this.props.currency;
        let currentCart = this.props.item;
        let currencyItems = this.currencySign;
        return currentCart.prices.map((each)=> {    
            if(each.currency === currentCurrency) {
               for(let symbol in currencyItems) {
                  if(symbol === this.props.currency) {
                     return (<p className = "saleItem__price" key={currentCurrency}>
                             <img src = {currencyItems[symbol]} alt="money"></img>
                              {each.amount}</p>)
                  }
               }
              
            }
           return null
          })
    }


    //Add to cart when the round green cart is clicked
      addItemToCart=(e)=>{
          e.preventDefault()
          if(!localStorage[this.cartStorage]) {
            localStorage[this.cartStorage] = JSON.stringify([]);          
          }

          let cartArray = JSON.parse(localStorage[this.cartStorage]);

          let currentProductObj = {};
          currentProductObj.id = this.props.item.id;
          currentProductObj.name = this.props.item.name; 
          currentProductObj.brand = this.props.item.brand;
          currentProductObj.uKey = this.props.item.name;
          currentProductObj.quantity = 1;  
          currentProductObj.attributesToPick = this.props.item.attributes;
          currentProductObj.gallery = this.props.item.gallery;
          currentProductObj.prices = this.props.item.prices;

          //Cannot generate a unique key (there are no attributes yet)
          let name = this.props.item.name;
          
         //  Adding products to cartArray or increment quantity
          if(cartArray.length === 0) {
              cartArray.push(currentProductObj)
          } else if(cartArray.length !== 0) {
              if(!cartArray.find(item => item.name === name)) {
                    cartArray.push(currentProductObj)
              }else if(cartArray.find(item => item.name === name)) (     
                  cartArray.forEach((each)=> {
                     if(each.name === name && each.uKey === name) {
                          each.quantity += 1   
                      } else if (each.name === name && each.uKey !== name) {
                        cartArray.push(currentProductObj)
                      }
                  })
              )
            }
            
          //End of adding products to cartArray or increment quantity
          localStorage[this.cartStorage] = JSON.stringify(cartArray)
          this.props.numberOfItems(cartArray)
          alert("Your item has been added to the cart");
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
                        
                        <p><span>{this.props.item.brand}</span> {this.props.item.name}</p>
                        {this.displayPrice()}
                    </div>
                </Link>
                
            </div>
        )
    }
}

/** <p style = {{fontFamily: "Raleway"}}>{this.displayPrice()}</p> */