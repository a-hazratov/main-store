import React, { Component } from 'react';
import './BigCartItemStyle.css';
import Plus from './SVG/plus-square.svg'
import Minus from './SVG/minus-square.svg' 
import Close from './SVG/close-sign.svg'

 class BigCartItem extends Component {
   constructor(props) {
     super(props)
     this.cart = "cart"
     this.state = {
      cart: []
     }
   }

// Getting the items from the storage if there are any
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
      return prices.map((each) => {
         if(each.currency === this.props.currency) {
            return [each.currency, each.amount]
         }
      })
   }

//Increment number of items when plus sign is clicked
   incrementItem=()=>{
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
      this.props.numOfItems(cart)
    
       }, 0)
   }

 // Decrement number of items when minus sign is clicked
   decrementItem=()=>{
      this.getDataFromStorage()
      let cart;
      setTimeout(()=> {
        cart = this.state.cart
        cart.map((each)=> {
           if(this.props.id === each.id && each.uKey === this.props.item.uKey) {
              if(each.quantity !== 0) {
                  each.quantity -= 1;
               }
           }
        })
     
     localStorage[this.cart] = JSON.stringify(cart)
     this.props.getData()
     this.props.numOfItems(cart) 
     }, 0)
   }

//Remove a certain item from the local storage and the shopping cart
   removeItem=()=>{
       this.getDataFromStorage()
       let cart;
       let itemToRemoveId;
       let indexOfItem;
       document.addEventListener('click', function(e) {
          itemToRemoveId = e.target.parentElement.getAttribute("id")
       })

       setTimeout(()=> {
          cart = this.state.cart
          cart.map((each)=> {
            if(each.uKey === itemToRemoveId) {
              indexOfItem = cart.indexOf(each)  
            }
          })
          cart.splice(indexOfItem, 1)
          localStorage[this.cart] = JSON.stringify(cart)
          this.props.getData()
          this.props.numOfItems(cart)
      
      }, 0)
   }
    
    render() {
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
                         <span className = "bigCart-remove" id = {this.props.item.uKey} onClick = {this.removeItem}><img src = {Close} alt="close icon"></img></span>
                         <img src={this.props.item.gallery[0]} alt = "product"></img>
                      </div>
                </div> 
            </div>
        )
    }
}

export default BigCartItem
