import React, { PureComponent } from 'react'
import styles from './cartItem.module.css';
import Plus from '../SVG/one-plus-sign.svg'
import Minus from '../SVG/one-minus-sign.svg'
import Close from '../SVG/close-sign.svg';



 class CartItem extends PureComponent {
    constructor(props) {
        super(props);
        this.cart = 'cart'
        this.state = {
             cart: []
        }  
    }
  //Set the price and the currency in the small cart
     setThePrice=()=> {
        let prices = this.props.item.prices;
        return prices.map(each => {
           if(each.currency === this.props.currency) {
              return [each.amount]
           }
           return null
        })
    } 

    //Set the attributes if there are any
    setTheAttributes=()=>{
        let attributes = this.props.item.attributes;
        if(this.props.item.hasOwnProperty('uKey')) {
            if(attributes) {
               return attributes.map(each => each.name === "Size" ? <li className={styles.liSize} key={each.value + each.name}>{each.value}</li> :
                                             each.name === "Capacity" ? <li className={styles.liCapacity} key={each.value + each.name}>{each.value}</li> :
                                             each.name === "Color" ? <li className={styles.liColor} style = {{backgroundColor: each.value}}
                                                                       key={each.value}></li>:
                                             each.name === "With USB 3 ports" ? <li className={styles.liUSB} key={each.value + each.name}>USB 3 ports:  {each.value}</li> :
                                             each.name === "Touch ID in keyboard" ? <li className={styles.liTouch} key={each.value + each.name}>Touch ID: {each.value}</li>: "")
            }
        } else if(!this.props.item.hasOwnProperty('uKey')){
          let itemInCart = this.props.item;
          if(itemInCart.attributes) {
          return (<li className={styles.liUSBCart}></li>)
          }
      }
    }

    getDataFromStorage=()=> {  
        if(localStorage[this.cart]) {
            this.setState({
                cart: JSON.parse(localStorage.getItem(this.cart))
            })
        }  
     }
    

    //Increment number of items when plus sign is clicked
    incrementItem=()=>{
       this.getDataFromStorage()
       let cart;
       setTimeout(()=> {
          cart = this.state.cart
          cart.forEach((each)=> {
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
          cart.forEach((each)=> {
             if(this.props.id === each.id && each.uKey === this.props.item.uKey) {
                if(each.quantity !== 1) {
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
   removeItem=(e)=>{
      this.getDataFromStorage()
      let cart;
      let indexOfItem;
      let itemToRemoveId = e.target.parentElement.getAttribute('id')
      
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
        
    render() {            
        return (
            
            <div className = {styles.cartItem}>
                <div className = {styles.cartItem__name}>
                        <div className={styles.col1}>
                          <h4>{this.props.item.brand}</h4>
                          <h5>{this.props.item.name}</h5>
                          <p className = {styles.cartItem__price}>{this.props.moneySign} {this.setThePrice()}</p>                      
                           
                           <ul className={styles.attrList}>
                            {this.setTheAttributes()}
                           </ul>
                        </div>
                        <div className={styles.col2}>
                          <span onClick = {this.incrementItem}><img src = {Plus} alt="increment"></img></span>
                           <span>{this.props.item.quantity}</span>
                           <span onClick = {this.decrementItem}><img src = {Minus} alt="decrement"></img></span>
                        </div>
                        <div className={styles.col3}>
                        <span className = {styles.cartOverlay_remove} id = {this.props.item.uKey} onClick = {this.removeItem}>         
                             <img src = {Close} alt="close icon"></img>
                        </span>
                          <img src = {this.props.item.gallery[0]} alt = "product"></img>
                        </div>
                  </div>
             </div>
        )
    }
}

export default CartItem;

