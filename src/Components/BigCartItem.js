import React, { PureComponent } from 'react';
import './ComStyles/BigCartItemStyle.css';
import Plus from './SVG/one-plus-sign.svg';
import Minus from './SVG/one-minus-sign.svg'; 
import Close from './SVG/close-sign.svg';



 class BigCartItem extends PureComponent {
   constructor(props) {
     super(props)
     this.cart = "cart";
     this.cartImage = React.createRef();
     this.rightArrow = React.createRef();
     this.leftArrow = React.createRef();
     this.allListItems = React.createRef();
     this.removeItemHere = React.createRef();
     this.currencySign= {
      USD : '\u0024',
      RUB : '\u20BD',
      JPY : '\u00A5',
      GBP : '\u00A3',
      AUD : '\u0024'
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
              return attributes.map(each => each.name === "Size" ? <li className="liSizeCart" key={each.value + each.name}>{each.value}</li> :
                                            each.name === "Capacity" ? <li className="liCapacityCart" key={each.value + each.name}>{each.value}</li> :
                                            each.name === "Color" ? <li className="liColorCart" style = {{backgroundColor: each.value}} key={each.value}></li>:
                                            each.name === "With USB 3 ports" ? <li className="liUSBCart" key={each.value + each.name}>USB 3 ports:  {each.value}</li> :
                                            each.name === "Touch ID in keyboard" ? <li className="liTouchCart" key={each.value + each.name}>Touch ID: {each.value}</li>: "")
         }
      } 
         
   }

   

 //display attributes inside render
   displayAttributes=()=>{
      if(!this.props.item.attributes) {
         return ""
      } else if(this.props.item.attributes){
           return  (this.props.item.attributes ? 
                     this.setTheAttributes()  : null)
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
                  return (<p className = "bigCartItem__price" key={each.amount}>
                           {currencyItems[symbol]}
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
   removeItem=(e)=>{
       this.getDataFromStorage()
       let cart;
       let indexOfItem;
       let itemToRemoveId = e.target.parentElement.getAttribute('id');
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
     
   }

   

  
    
    render() {
        return (
            <div className = "big-cart">
                <div className = "bigCartItem__name">
                    
                      <div className="bigCol1">
                      <span className = "bigCart-remove-alt" id = {this.props.item.uKey} ref = {this.removeItemHere} onClick = {this.removeItem}>
                         <img src = {Close} alt="close icon"></img>
                       </span>
                         <h3>{this.props.item.brand}</h3>
                         <h4>{this.props.item.name}</h4>
                             {this.setThePrice()}                 
                         
                         <ul ref = {this.allListItems}> 
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

