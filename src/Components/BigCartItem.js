import React, { Component } from 'react';
import './ComStyles/BigCartItemStyle.css';
import Plus from './SVG/plus-square.svg';
import Minus from './SVG/minus-square.svg'; 
import Close from './SVG/close-sign.svg';
import Dollar from './SVG/dollar-sign.svg';
import AusDollar from './SVG/dollar-sign.svg';
import Pound from './SVG/pound-sign.svg';
import Yen from './SVG/yen-sign.svg';
import Ruble from './SVG/ruble-sign.svg';


 class BigCartItem extends Component {
   constructor(props) {
     super(props)
     this.cart = "cart";
     this.cartImage = React.createRef();
     this.rightArrow = React.createRef();
     this.leftArrow = React.createRef();
     this.currencySign= {
      USD : Dollar,
      RUB : Ruble,
      JPY : Yen,
      GBP : Pound,
      AUD : AusDollar
     }
     this.state = {
       cart: [],
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
      if(this.props.item.hasOwnProperty('uKey')) {
         let attributes = this.props.item.attributes;
         if(attributes) {
              return attributes.map(each => each.name === "Size" ? <li className="liSizeCart">{each.value}</li> :
                                            each.name === "Capacity" ? <li className="liCapacityCart">{each.value}</li> :
                                            each.name === "Color" ? <li className="liColorCart" style = {{backgroundColor: each.value}}></li>:
                                            each.name === "With USB 3 ports" ? <li className="liUSBCart">USB 3 ports:  {each.value}</li> :
                                            each.name === "Touch ID in keyboard" ? <li className="liTouchCart">Touch ID: {each.value}</li>: "")
         }
      } 
         
   }

   // Set the attributes to products in the Big Cart, after adding products from the PLP
    setNewAttributes=(attributeName)=>{
      let output = null;
      let item = this.props.item;
      let attrArray = item.attributesToPick; //Getting an array of objects with attributes
      let found = attrArray.find((each)=> each.name === attributeName)
      if(attributeName === "Capacity") {
         output = found.items.map((each) => 
         <li className = "liCapacityCart__new" onClick={this.chooseCapacity}><p>{each.value}</p></li>)    
         return [output]          
     }

      if(attributeName === "Color") {
         output = found.items.map((each) => 
         <li className = "liColorCart__new" onClick={this.chooseColor} style={{backgroundColor: each.value}}><p>{each.displayValue}</p></li>)    
          return [output]          
      }
      if(attributeName === "Size") {
         output = found.items.map((each) => 
         <li className = "liSizeCart__new" onClick={this.chooseSize}><p>{each.value}</p></li>)    
         return [ output]          
     }
     if (attributeName === "With USB 3 ports" ) {  
      output = found.items.map((each) => 
      <li className = "liUSBCart__new" onClick={this.chooseUSB}><p>{each.value}</p></li>)    
       return [<h5>USB 3 ports:</h5>, output]       
     }
     if (attributeName === "Touch ID in keyboard" ) {  
      output = found.items.map((each) => 
      <li className = "liTouchCart__new" onClick={this.chooseTouchId}><p>{each.value}</p></li>)    
       return [<h5>Touch ID:</h5>, output]       
     }
    }

 //display attributes inside render
   displayAttributes=()=>{
      if(!this.props.item.attributes && !this.props.item.attributesToPick) {
         return ""
      } else if(this.props.item.attributes || this.props.item.attributesToPick){
           return  (this.props.item.attributes ? 
                     this.setTheAttributes()  :  
                     this.props.item.attributesToPick.map((each)=>
                      this.setNewAttributes(each.name) ))
      }
   }

//Set the price and the currency in the big cart
   setThePrice=()=> {
      let currencyItems = this.currencySign;
      let prices = this.props.item.prices;
       return prices.map((each)=> {    
         if(each.currency === this.props.currency) {
            for(let symbol in currencyItems) {
               if(symbol === this.props.currency) {
                  return (<p className = "bigCartItem__price">
                          <img src = {currencyItems[symbol]} alt="money"></img>
                           {each.amount}</p>)
               }
            }
           
         }
        return null
       })
   }

//Increment number of items when plus sign is clicked
   incrementItem=()=>{
       this.getDataFromStorage()
       let cart; 
       setTimeout(()=> {
          cart = this.state.cart
          cart.map((each)=>{
              if(this.props.id === each.id && each.uKey === this.props.item.uKey) {
                  return each.quantity += 1;
              }
              return null
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
              if(each.quantity !== 1) {
                  each.quantity -= 1;
               }
           }
           return null
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
          cart.forEach((each, index)=> {
            if(each.uKey === itemToRemoveId) {
              indexOfItem =  index;  
            }
          })
          cart.splice(indexOfItem, 1)
          localStorage[this.cart] = JSON.stringify(cart)
          this.props.getData()
          this.props.numOfItems(cart)
      
      }, 0)
   }

   //Handle the click on the right arrow on the image
   handleRightArrow=()=>{
      let image = this.cartImage.current;
      let imageArray = this.props.item.gallery;
      let rightArrow = this.rightArrow.current;
      let leftArrow = this.leftArrow.current;
      let imgIndex = imageArray.indexOf(image.src);
      if(imageArray[imgIndex+1]) {
         image.src =  imageArray[imgIndex+1]
         leftArrow.style.display = 'block'
      } else {
         image.src =  imageArray[imgIndex];
         rightArrow.style.display = 'none'
      }
      //imageArray[imgIndex+1] ? image.src =  imageArray[imgIndex+1] : image.src =  imageArray[0];
   }
   
    //Handle the click on the left arrow on the image
   handleLeftArrow=()=>{
      let image = this.cartImage.current;
      let imageArray = this.props.item.gallery;
      let rightArrow = this.rightArrow.current;
      let imgIndex = imageArray.indexOf(image.src);
      if(imageArray[imgIndex-1]) {
         image.src =  imageArray[imgIndex-1]
         rightArrow.style.display = 'block'
      } else {
         image.src =  imageArray[imgIndex];
      }
     // imageArray[imgIndex-1] ? image.src =  imageArray[imgIndex-1] : image.src =  imageArray[0];
   }
    
    render() {
        return (
            <div className = "big-cart">
                <div className = "bigCartItem__name">
                    
                      <div className="bigCol1">
                         <h3>{this.props.item.brand}</h3>
                         <h4>{this.props.item.name}</h4>
                             {this.setThePrice()}                 
                         
                         <ul> 
                           {this.displayAttributes()} 
                         </ul>
                      </div>
                      <div className="bigCol2">
                        <span onClick={this.incrementItem}><img src = {Plus} alt="increment"></img></span>
                         <span className="quantity">{this.props.item.quantity}</span>
                         <span onClick={this.decrementItem}><img src = {Minus} alt="decrement"></img></span>
                      </div>
                      <div className="bigCol3">
                         <span className = "bigCart-remove" id = {this.props.item.uKey} onClick = {this.removeItem}><img src = {Close} alt="close icon"></img></span>
                         <img src={this.props.item.gallery[0]} alt = "product" ref={this.cartImage}></img>
                         
                        { this.props.item.gallery.length > 1 ? (<span className="bigCart-leftArrow" 
                                                                onClick={this.handleLeftArrow} 
                                                                 ref={this.leftArrow}>&#10096;</span>) : null}
                        { this.props.item.gallery.length > 1 ? (<span className="bigCart-rightArrow"
                                                                 onClick={this.handleRightArrow}
                                                                 ref={this.rightArrow}>&#10097;</span>): null }
                      </div>
                </div> 
            </div>
        )
    }
}

export default BigCartItem

/**{this.setTheAttributes()}
 * 
 *                            {this.props.item.attributes ? 
                             this.props.item.attributes.map((each)=>
                              this.setTheAttributes(each.name) ) :  
                              this.props.item.attributesToPick.map((each)=>
                              this.setTheAttributes(each.name) )} 
                              
                              
                              if(!this.props.item.hasOwnProperty('uKey')) {
         let itemInCart = this.props.item;
         if(itemInCart.attributesToPick) {
           return this.setNewAttributes(attrName)
         }
         
      }
  */