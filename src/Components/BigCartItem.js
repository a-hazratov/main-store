import React, { Component } from 'react';
import './BigCartItemStyle.css';
import Plus from './SVG/plus-square.svg'
import Minus from './SVG/minus-square.svg' 

 class BigCartItem extends Component {
   constructor(props) {
     super(props)
     this.cart = "cart"
     this.state = {
      cart: []
     }
   }


   getDataFromStorage=()=> {  
    if(localStorage[this.cart]) {
        this.setState({
            cart: JSON.parse(localStorage.getItem(this.cart))
        })
    }
   
 }



  //Set the attributes if there are any
  setTheAttributes=()=>{
    let attributes = this.props.item.attributes;
    if(attributes) {
    return attributes.map(each => each.name === "Size" ? <li>{each.value}</li> :
                                  each.name === "Capacity" ? each.value :
                                  each.name === "Color" ? <li style = {{backgroundColor: each.value}}></li>: "")
    }
}

//Set the price and the currency in the small cart
setThePrice=()=> {
  let prices = this.props.item.prices;
  return prices.map(each => {
      if(each.currency === this.props.currency) {
          return [each.currency, each.amount]
      }
  })
}

//Increment number of items when plus sign is clicked
 incrementItem=()=>{
  console.log("Plus click occured", "id is " + this.props.id)
  this.getDataFromStorage()
  let cart;
  
  setTimeout(()=> {
    cart = this.state.cart
    cart.map((each)=> {
      if(this.props.id === each.id && each.uKey === this.props.item.uKey) {
          each.quantity += 1;
      }
    })
     
    localStorage[this.cart] = JSON.stringify(cart)
    this.props.getData()
    console.log(cart)
    
  }, 0)
 }

 // Decrement number of items when minus sign is clicked
 decrementItem=()=>{
  console.log("Minus click occured", "id is " + this.props.id)
  this.getDataFromStorage()
  let cart;
  
  setTimeout(()=> {
    cart = this.state.cart
    cart.map((each)=> {
      if(this.props.id === each.id && each.uKey === this.props.item.uKey) {
        console.log(each)
        if(each.quantity !== 0) {
          each.quantity -= 1;
        }
      }
    })
     
    localStorage[this.cart] = JSON.stringify(cart)
    this.props.getData()
    console.log(cart)
    
  }, 0)
}
    
    render() {
      console.log("Big Cart Item " + this.state.cart)
     
        return (
            <div className = "big-cart">
                <div className = "bigCartItem__name">
                    
                      <div className="bigCol1">
                        <h3>{this.props.item.name}</h3>
                        <p className = "bigCartItem__price">{this.setThePrice()}</p>                      
                         
                         <ul> 
                         {this.setTheAttributes()}     
                         </ul>
                      </div>
                      <div className="bigCol2">
                        <span onClick={this.incrementItem}><img src = {Plus} alt="increment"></img></span>
                         <span className="quantity">{this.props.item.quantity}</span>
                         <span onClick={this.decrementItem}><img src = {Minus} alt="decrement"></img></span>
                      </div>
                      <div className="bigCol3">
                        <img src={this.props.item.gallery[0]} alt = "product"></img>
                      </div>
                  
                </div> 
            </div>
        )
    }
}

export default BigCartItem
