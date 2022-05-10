import React, { PureComponent } from 'react';
import styles from './bigCartItem.module.css';
import Plus from '../SVG/one-plus-sign.svg';
import Minus from '../SVG/one-minus-sign.svg'; 
import Close from '../SVG/close-sign.svg';



 class BigCartItem extends PureComponent {
   constructor(props) {
     super(props)
     this.cart = "cart";
   
     this.currencySign= {
      USD : '\u0024',
      RUB : '\u20BD',
      JPY : '\u00A5',
      GBP : '\u00A3',
      AUD : '\u0024'
     }
     this.state = {
       cart: [],
       imgSrc: this.props.item.gallery[0],
       imageIndex: 0
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
              return attributes.map(each => each.name === "Size" ? <li className={styles.liSizeCart} key={each.value + each.name}>{each.value}</li> :
                                            each.name === "Capacity" ? <li className={styles.liCapacityCart} key={each.value + each.name}>{each.value}</li> :
                                            each.name === "Color" ? <li className={styles.liColorCart} style = {{backgroundColor: each.value}} key={each.value}></li>:
                                            each.name === "With USB 3 ports" ? <li className={styles.liUSBCart} key={each.value + each.name}>USB 3 ports:  {each.value}</li> :
                                            each.name === "Touch ID in keyboard" ? <li className={styles.liTouchCart} key={each.value + each.name}>Touch ID: {each.value}</li>: "")
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
            return (<p className = {styles.bigCartItem__price} key={each.amount}>
                   {currencyItems[this.props.currency]}  {each.amount}</p>)
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
      let imageArray = this.props.item.gallery;
      let index = this.state.imageIndex
      if(imageArray[index+1]) {
         this.setState({
            imgSrc: imageArray[index+1],
            imageIndex: index+1
         })
        
      } else {
         this.setState({
            imgSrc: imageArray[index],
            imageIndex: index
         })
      }
   }
   
    //Handle the click on the left arrow on the image
   handleLeftArrow=()=>{
      let imageArray = this.props.item.gallery;
     let index = this.state.imageIndex;
      if(imageArray[index-1]) {
         this.setState({
            imgSrc: imageArray[index-1],
            imageIndex: index-1
         })
      } else {
         this.setState({
            imgSrc: imageArray[index],
            imageIndex: index
         })
      }
   }

   

  
    
    render() {
        return (
            <div className = {styles.big_cart}>
                <div className = {styles.bigCartItem__name}>
                    
                      <div className={styles.bigCol1}>
                      <span className = {styles.bigCart_remove_alt} id = {this.props.item.uKey} onClick = {this.removeItem}>
                         <img src = {Close} alt="close icon"></img>
                       </span>
                         <h3>{this.props.item.brand}</h3>
                         <h4>{this.props.item.name}</h4>
                             {this.setThePrice()}                 
                         
                         <ul> 
                           {this.displayAttributes()} 
                         </ul>
                      </div>
                      <div className={styles.bigCol2}>
                        <span onClick={this.incrementItem}><img src = {Plus} alt="increment"></img></span>
                         <span className={styles.quantity}>{this.props.item.quantity}</span>
                         <span onClick={this.decrementItem}><img src = {Minus} alt="decrement"></img></span>
                      </div>
                      <div className={styles.bigCol3}>
                         <span className = {styles.bigCart_remove} id = {this.props.item.uKey} onClick = {this.removeItem}><img src = {Close} alt="close icon"></img></span>
                         <img src={this.state.imgSrc} alt = "product"></img>
                         
                        { this.props.item.gallery.length > 1 ? (<span className={styles.bigCart_leftArrow} 
                                                                onClick={this.handleLeftArrow}>&#10096;</span>) : null}
                        { this.props.item.gallery.length > 1 ? (<span className={styles.bigCart_rightArrow}
                                                                 onClick={this.handleRightArrow}>&#10097;</span>): null }
                      </div>
                </div> 
            </div>
        )
    }
}

export default BigCartItem

