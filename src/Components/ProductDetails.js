import React, { PureComponent } from 'react'
import { gql } from "apollo-boost";
import {graphql} from 'react-apollo';




const getOneItem = gql`
   query get_One_Item($id: String!)  {
        product(id: $id) {
            id
            name
            inStock
            gallery   
            category  
            description
            brand
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
    }`







class ProductDetails extends PureComponent {
    constructor (props) {
        super(props);
        this.cartStorage = 'cart';
        this.onceClickedUsb = "prodDetails__prodInfo__usb clickedUsbBox";
        this.onceClickedTouch = "prodDetails__prodInfo__touch clickedTouchBox";
        this.onceClickedSize = "prodDetails__prodInfo__size clickedSizeBox";  
        this.onceClickedColor = "prodDetails__prodInfo__color clickedColorBox";
        this.state = {
            data: null,
            currentProduct: {}
        }
    }

     
    
    componentDidMount() {
        setTimeout(() => {
            this.setState({   
                 data: this.props.data.product  
            })
             
        }, 1000)
    }

  

    //Add products to localStorage and the shopping cart
    addToCart =()=>{
      // let product = this.state.data.find((each) => each.id === this.props.match.params.id)
         let product = this.state.data
        if(!localStorage[this.cartStorage]) {
            localStorage[this.cartStorage] = JSON.stringify([]);          
        }

        let cartArray = JSON.parse(localStorage[this.cartStorage]);
       
        let currentProductObj = this.state.currentProduct;
            currentProductObj.id = product.id;
            currentProductObj.name =   product.name; 
            currentProductObj.brand = product.brand;
            currentProductObj.quantity = 1;  
            currentProductObj.gallery = product.gallery;
            currentProductObj.prices = product.prices;
        //Generate a unique key based on attributes selected    
        let uKey = null;
        let keyAttritutes = [];
        if(currentProductObj.attributes) {
            currentProductObj.attributes.map(each => 
                keyAttritutes.push("_"+ each.name +"-"+ each.value))
            /*for (let i = 0; i < currentProductObj.attributes.length; i++) {
                keyAttritutes.push("_"+currentProductObj.attributes[i].name+"-"+currentProductObj.attributes[i].value)
            }*/
            uKey= currentProductObj.id+"_"+keyAttritutes.join('');
        } else {
               uKey = currentProductObj.id;
        }
          currentProductObj.uKey = uKey;
        //End of generating a unique key based on attributes selected 
         
        //  Adding products to cartArray or increment quantity
        if(cartArray.length === 0) {
              cartArray.push(currentProductObj)
        } else if(cartArray.length !== 0) {
              if(!cartArray.find(item => item.uKey === uKey)) {
                  cartArray.push(currentProductObj)
              } else if (cartArray.find(item => item.uKey === uKey)) {
                 cartArray.forEach((item) => {
                     if(item.uKey === uKey) {
                         item.quantity += 1
                     }
                 })
              } 
        }
        //End of adding products to cartArray or increment quantity

        //Check if the product has attributes and they have been selected
            if(product.attributes.length !== 0) {
                let prodAttributes = [];
                let currCartAttributes = [];
                for(let i = 0; i < product.attributes.length; i++) {
                    if(product.attributes[i].name === "Color" || product.attributes[i].name === "Capacity" || product.attributes[i].name === "Size") {
                    prodAttributes.push(product.attributes[i].name)
                    }
                }
                if(!currentProductObj.attributes || currentProductObj.attributes.length === 0) {
                    alert("Please, select the attributes of the product")
                    return
                } else if (currentProductObj.attributes || currentProductObj.attributes.length !== 0) {
                    for(let j = 0; j < currentProductObj.attributes.length; j++) {
                        currCartAttributes.push(currentProductObj.attributes[j].name)
                    } 
                    
                    if(this.checkForAttributes(currCartAttributes, prodAttributes)) {
                        localStorage[this.cartStorage] = JSON.stringify(cartArray)
                        this.props.numberOfItems(cartArray)
                        cartArray = []
                        this.setState({
                        currentProduct: {}
                        })
                        alert("Your item has been added to the cart")
                        this.removeStyles()
                    } else {
                        alert("Please, select all the attributes")
                    }
                } 
                            
             } else {
                 //Adding to the cart if there are no attributes to choose
                 localStorage[this.cartStorage] = JSON.stringify(cartArray)
                 this.props.numberOfItems(cartArray)
                 cartArray = []
                 this.setState({
                 currentProduct: {}
                 })
                 alert("Your item has been added to the cart")
                 this.removeStyles()
             }
        }  

     
         /**Function that checks if all attributes have been selected , to be used inside addToCart function */
         checkForAttributes=(attr, target)=> {
             return target.every(item=> attr.includes(item))
         }

        /**Remove styles from clicked attributes on product page */
         removeStyles=()=> {
            let capacitySizeStyleRemove = document.querySelector(".clickedSizeBox");
            let colorStyleToRemove = document.querySelector(".clickedColorBox");
            let usbStyleToRemove = document.querySelector(".clickedUsbBox");
            let touchStyleToRemove = document.querySelector(".clickedTouchBox");
            if(capacitySizeStyleRemove) {
                capacitySizeStyleRemove.classList.remove("clickedSizeBox");
            }
            if (colorStyleToRemove) {
                colorStyleToRemove.classList.remove("clickedColorBox")
            }  
            if (usbStyleToRemove) {
                usbStyleToRemove.classList.remove("clickedUsbBox")
            }  
            if (touchStyleToRemove) {
                touchStyleToRemove.classList.remove("clickedTouchBox")
            }  
         }

       /*Choose capacity of a product*/
        chooseCapacity=(event)=>{ 
           //Setting indicators if size was clicked
           let onceClickedAttr = this.onceClickedSize
           let allSizes = document.querySelectorAll(".prodDetails__prodInfo__size")
           allSizes.forEach((size)=> {
              if(size.getAttribute("class") === onceClickedAttr ) {
                  size.classList.remove("clickedSizeBox")
              } else if (size === event.target.parentNode) {
                size.classList.add("clickedSizeBox")
              }
           })
            // setting the right size in the shopping cart
           let displayValue = event.target.textContent;
           let currentProductObj = this.state.currentProduct;
         
           if(!currentProductObj.hasOwnProperty("attributes")) {
               currentProductObj.attributes = [];
               currentProductObj.attributes.push({name: "Capacity", value: displayValue})
           } else if (currentProductObj.hasOwnProperty("attributes") && currentProductObj.attributes.length !== 0) {
                if(!currentProductObj.attributes.find((item) => item.name === "Capacity" )) {
                    currentProductObj.attributes.push({name: "Capacity", value: displayValue})
                } else if (currentProductObj.attributes.find((item) => item.name === "Capacity")) {
                     currentProductObj.attributes.map((each) => {
                    if(each.name === "Capacity" && each.value !== displayValue) {
                        each.value = displayValue
                    } else if (each.name === "Capacity" && each.value === displayValue) {
                       each.value = ""
                    }
                    })
                }
            } else if (currentProductObj.hasOwnProperty("attributes") && currentProductObj.attributes.length === 0) {
            currentProductObj.attributes.push({name: "Capacity", value: displayValue})
            }
            this.setState({
                currentProduct: currentProductObj
            }) 
        }

    /**Choose With USB 3 ports attribute */    
        chooseUSB=(event)=>{ 
          //Setting indicators if size was clicked
          let onceClickedAttr = this.onceClickedUsb;
          let allUsb = document.querySelectorAll(".prodDetails__prodInfo__usb")
              allUsb.forEach((size)=> {
                 if(size.getAttribute("class") === onceClickedAttr ) {
                    size.classList.remove("clickedUsbBox")
                 } else if (size === event.target.parentNode) {
                    size.classList.add("clickedUsbBox")
                 }
              })
         // setting the right size in the shopping cart
         let displayValue = event.target.textContent;
         let currentProductObj = this.state.currentProduct;
      
         if(!currentProductObj.hasOwnProperty("attributes")) {
            currentProductObj.attributes = [];
            currentProductObj.attributes.push({name: "With USB 3 ports", value: displayValue})
         } else if (currentProductObj.hasOwnProperty("attributes") && currentProductObj.attributes.length !== 0) {
             if(!currentProductObj.attributes.find((item) => item.name === "With USB 3 ports" )) {
                 currentProductObj.attributes.push({name: "With USB 3 ports", value: displayValue})
             } else if (currentProductObj.attributes.find((item) => item.name === "With USB 3 ports")) {
                  currentProductObj.attributes.map((each) => {
                 if(each.name === "With USB 3 ports" && each.value !== displayValue) {
                     each.value = displayValue
                 } else if (each.name === "With USB 3 ports" && each.value === displayValue) {
                    each.value = ""
                 }
                 })
             }
         } else if (currentProductObj.hasOwnProperty("attributes") && currentProductObj.attributes.length === 0) {
           currentProductObj.attributes.push({name: "With USB 3 ports", value: displayValue})
         }
         this.setState({
             currentProduct: currentProductObj
         }) 
       } 

     /**Choose Touch ID in keyboard */
     chooseTouchId=(event)=>{ 
        //Setting indicators if size was clicked
        let onceClickedAttr = this.onceClickedTouch;
        let allTouch = document.querySelectorAll(".prodDetails__prodInfo__touch")
        allTouch.forEach((size)=> {
           if(size.getAttribute("class") === onceClickedAttr ) {
               size.classList.remove("clickedTouchBox")
           } else if (size === event.target.parentNode) {
             size.classList.add("clickedTouchBox")
           }
        })
         // setting the right size in the shopping cart
        let displayValue = event.target.textContent;
        let currentProductObj = this.state.currentProduct;
      
        if(!currentProductObj.hasOwnProperty("attributes")) {
            currentProductObj.attributes = [];
            currentProductObj.attributes.push({name: "Touch ID in keyboard", value: displayValue})
        } else if (currentProductObj.hasOwnProperty("attributes") && currentProductObj.attributes.length !== 0) {
             if(!currentProductObj.attributes.find((item) => item.name === "Touch ID in keyboard" )) {
                 currentProductObj.attributes.push({name: "Touch ID in keyboard", value: displayValue})
             } else if (currentProductObj.attributes.find((item) => item.name === "Touch ID in keyboard")) {
                  currentProductObj.attributes.map((each) => {
                 if(each.name === "Touch ID in keyboard" && each.value !== displayValue) {
                     each.value = displayValue
                 } else if (each.name === "Touch ID in keyboard" && each.value === displayValue) {
                    each.value = ""
                 }
                 })
             }
         } else if (currentProductObj.hasOwnProperty("attributes") && currentProductObj.attributes.length === 0) {
         currentProductObj.attributes.push({name: "Touch ID in keyboard", value: displayValue})
         }
         this.setState({
             currentProduct: currentProductObj
         }) 
     } 


    /** Choose size of the product */
       chooseSize=(event)=>{ 
        //Setting indicators if size was clicked
        let onceClickedAttr = this.onceClickedSize
        let allSizes = document.querySelectorAll(".prodDetails__prodInfo__size")
         allSizes.forEach((size)=> {
            if(size.getAttribute("class") === onceClickedAttr ) {
                size.classList.remove("clickedSizeBox")
            } else if (size === event.target.parentNode) {
                size.classList.add("clickedSizeBox")
            }
         })
        // setting the right size in the shopping cart
        let displayValue = event.target.textContent;
        let currentProductObj = this.state.currentProduct;
        if(!currentProductObj.hasOwnProperty("attributes")) {
            currentProductObj.attributes = [];
            currentProductObj.attributes.push({name: "Size", value: displayValue})
        } else if (currentProductObj.hasOwnProperty("attributes") && currentProductObj.attributes.length > 0) {
            currentProductObj.attributes.map((each)=> {
            let index = currentProductObj.attributes.indexOf(each);
            if(each.name === "Size" && each.value === displayValue)  {
                currentProductObj.attributes.splice(index, 1);
                console.log("Size exists, the clicked button is the same, we remove the object")
            } else if(each.name === "Size" && each.value !== displayValue) {
                currentProductObj.attributes.splice(index, 1);
                currentProductObj.attributes.push({name: "Size",value: displayValue})
                console.log("Size exists, new box clicked")
            } 
            })         
        } else if (currentProductObj.hasOwnProperty("attributes") && currentProductObj.attributes.every(item => !item.name === "Size"))  {    
            currentProductObj.attributes.push({name: "Size",   value: displayValue})
        }
        this.setState({
            currentProduct: currentProductObj
        }) 
      }
     
           



    /*Choose color of products*/
     chooseColor=(event)=>{
        let onceClickedAttr = this.onceClickedColor
        let clickedColor = event.target.style.backgroundColor;
        let allBoxes = document.querySelectorAll('.prodDetails__prodInfo__color')
             allBoxes.forEach((box)=> {
            if(box.getAttribute("class") === onceClickedAttr) {
                box.classList.remove('clickedColorBox')
            } else if (box === event.target) {
                box.classList.add("clickedColorBox")
            }
             })   
         //Setting the chosen color for the shopping cart
         let currentProductObj = this.state.currentProduct;
        if(!currentProductObj.hasOwnProperty("attributes")) {
            currentProductObj.attributes = [];
            currentProductObj.attributes.push({name: "Color", value: clickedColor})
        } else if (currentProductObj.hasOwnProperty("attributes") && currentProductObj.attributes.length !== 0) {
            if(!currentProductObj.attributes.find((item) => item.name === "Color" )) {
                currentProductObj.attributes.push({name: "Color", value: clickedColor})
            } else if (currentProductObj.attributes.find((item) => item.name === "Color")) {
                currentProductObj.attributes.map((each) => {
                    if(each.name === "Color" && each.value !== clickedColor) {
                        each.value = clickedColor
                    } else if (each.name === "Color" && each.value === clickedColor) {
                        each.value = ""
                    }
                })
            }
        } else if (currentProductObj.hasOwnProperty("attributes") && currentProductObj.attributes.length === 0) {
             currentProductObj.attributes.push({name: "Color", value: clickedColor})
        }    
        this.setState({
            currentProduct: currentProductObj
        })   
     }
    

    
    //Setting attributes and attribute names of the product 
     setAttribute=(attributeName)=> {
        let output = null;
        //let item = this.state.data.find((each) => each.id === this.props.match.params.id)
           let item = this.state.data
    
        
          let attrArray = item.attributes; //Getting an arry of objects with attributes 
          let found = attrArray.find((each)=> each.name === attributeName)
         
          if(attributeName === "Capacity") {
              output = found.items.map((each) => 
              <div className = "prodDetails__prodInfo__size" onClick={this.chooseCapacity}><h4>{each.value}</h4></div>)    
              return [<h4>{attributeName}</h4>, output]          
          }
          if (attributeName === "Color") { 
              output = found.items.map((each) => 
              <div className = "prodDetails__prodInfo__color"  onClick={this.chooseColor} style={{backgroundColor: each.value}}><p>{each.displayValue}</p></div>)    
               return [<h4>{attributeName}</h4>, output]        
          } 
          if (attributeName === "Size" ) {  
              output = found.items.map((each) => 
              <div className = "prodDetails__prodInfo__size" onClick={this.chooseSize}><h4>{each.value}</h4></div>)    
               return [<h4>{attributeName}</h4>, output]       
          }
          if (attributeName === "With USB 3 ports" ) {  
            output = found.items.map((each) => 
            <div className = "prodDetails__prodInfo__usb" onClick={this.chooseUSB}><h4>{each.value}</h4></div>)    
             return [<h4>{attributeName}</h4>, output]       
        }
        if (attributeName === "Touch ID in keyboard" ) {  
            output = found.items.map((each) => 
            <div className = "prodDetails__prodInfo__touch" onClick={this.chooseTouchId}><h4>{each.value}</h4></div>)    
             return [<h4>{attributeName}</h4>, output]       
        }
      }
      
      
     
   
    render() {
      let item = this.state.data
   
        
      if(!item){
        return (<div className = "prodDetails"></div>)
      }

        
      // Display the price in the product card
       let currency = this.props.currency
       function displayPrice() {
          let currentCurrency = currency;
          let currentCart = item;
          let price = currentCart.prices.map((each) => {
              if(each.currency === currentCurrency) {
                  return each.amount
              }
        })
         return [currentCurrency, price]
       }

        //Inserts images acording to the number of images available (max 5-6)
        let image = null;
        if (item.gallery.length > 0) {    
            image = (
              <div className = "prodDetails__sideImg">
               {item.gallery.map((each)=>{
                return <img src = {each} alt = "smyh" onClick={changeImg}/>
               })}
              </div>
            )
          };
       
          //Replaces the big img with the clicked side img 
          function changeImg (e) {
                let clickedImg = e.target.src
                let newPlace = document.querySelector(".prodDetails__bigImg img")
                newPlace.src = clickedImg
        }
    
          
        return (
            
            <div className = "prodDetails">
                
                {image}
                <div className = "prodDetails__bigImg">
                    <img src = {item.gallery[0]} alt = {item.category}/>
                </div>
                <div className = "prodDetails__prodInfo">
                    <div className = "prodDetails__prodInfo__title">
                        <h2>{item.brand}</h2>
                        <h3>{item.name}</h3>
                    </div>
                    <div className = "prodDetails__prodInfo__attr"> 
                       {item.attributes.map((each)=> this.setAttribute(each.name) )}   
                    </div>
                    <div className = "prodDetails__prodInfo__price">
                        <h4>Price: </h4>
                        <h4>{displayPrice()}</h4>
                    </div>
                    <div className = "prodDetails__prodInfo__button">
                        <button type="button" onClick={this.addToCart}>ADD TO CART</button>
                        
                        <div className="desc   " dangerouslySetInnerHTML={{__html: item.description}}></div>
                    </div>
                </div> 
            </div>
        )
    }
}

export default graphql(getOneItem, {
    options:(props)=>{
        return {
            variables: {
                id: props.match.params.id
            }
        }
    }
})(ProductDetails);



