import React, { PureComponent } from 'react'
import styles from './product-details.module.css';
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
        this.currencySign= {
            USD : '\u0024',
            RUB : '\u20BD',
            JPY : '\u00A5',
            GBP : '\u00A3',
            AUD : '\u0024'
           }
        this.state = {
            data: null,
            currentProduct: {},
            imageSrc: null
        }
    }

     
    
      componentDidMount() { 
        setTimeout(() => {
            this.setState({   
                 data: this.props.data.product  
            })
            this.setAttrClass();
        }, 1000)
      }

    

  
        //Setting classes for attributes in the state
        setAttrClass=()=>{
            let attributes = JSON.parse(JSON.stringify(this.state.data.attributes));
            if(attributes.length > 0) {
                attributes.map(each => each.activeClass = null)
            } else {
                return
            }

            this.setState({
                attributes: attributes
            })
        }

        //Toggle attributes
        toggleClass=(n, attrName)=>{
           let attributes = [...this.state.attributes]
           attributes.map((each)=> {
               if(each.name === attrName && each.activeClass !== n) {
                   return each.activeClass = n
                } else if (each.name === attrName && each.activeClass === n) {
                    return each.activeClass = null
                } return null
           } )
           this.setState({
               attributes: attributes
           })
        }

        //set size className, to be used for size and capacity attribute classNames
        setSizeClass=(index, name)=>{
               let attr = this.state.attributes;
               if(attr) {
                   let filtered = attr.filter(item => item.name === name)
                    if(filtered[0].activeClass === index ) {
                        return `${styles.clickedSizeBox}`
                    } else  {
                       
                        return `${styles.prodDetails__prodInfo__size}`
                    }
               }
        }

        //set color className
        setColorClass=(index, name)=>{
            let attr = this.state.attributes;
            if(attr) {
                let filtered = attr.filter(item => item.name === name)
                 if(filtered[0].activeClass === index ) {
                     return `${styles.clickedColorBox}`
                 } else  {
                    
                     return `${styles.prodDetails__prodInfo__color}`
                 }
            }
        }
        //set usb classNames
        setUsbClass=(index, name)=>{
            let attr = this.state.attributes;
            if(attr) {
                let filtered = attr.filter(item => item.name === name)
                 if(filtered[0].activeClass === index ) {
                     return `${styles.clickedUsbBox}`
                 } else  {
                    
                     return `${styles.prodDetails__prodInfo__usb}`
                 }
            }
        }

        //set TouchId classNames
        setTouchClass=(index, name)=>{
            let attr = this.state.attributes;
            if(attr) {
                let filtered = attr.filter(item => item.name === name)
                 if(filtered[0].activeClass === index ) {
                     return `${styles.clickedTouchBox}`
                 } else  {
                    
                     return `${styles.prodDetails__prodInfo__touch}`
                 }
            }
        }


        //Add products to localStorage and the shopping cart
      addToCart =()=>{ 
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
                product.attributes.map(each => prodAttributes.push(each.name))
                if(!currentProductObj.attributes || currentProductObj.attributes.length === 0) {
                    alert("Please, select the attributes of the product")
                    return
                } else if (currentProductObj.attributes || currentProductObj.attributes.length !== 0) {
                   
                    currentProductObj.attributes.map(each => currCartAttributes.push(each.name))
                    
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
            let attr = this.state.attributes;
            if(attr) {
                attr.map((each)=>{
                    if(each.activeClass !== null) {
                        return each.activeClass = null
                    } return null
                })
            }
            this.setState({
                attributes: attr
            })
       }

       /*Choose capacity of a product*/
       chooseCapacity=(event, index, attr)=>{ 
           //Setting visual indicators if size was clicked
           this.toggleClass(index, attr)
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
                    } return null
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
       chooseUSB=(event, index, attr)=>{ 
          //Setting indicators if size was clicked
          this.toggleClass(index, attr)
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
                 } return null
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
      chooseTouchId=(event, index, attr)=>{ 
        //Setting indicators if size was clicked
        this.toggleClass(index, attr);
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
                 } return null
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
      chooseSize=(event,index, attr)=>{ 
        //Setting visual indicators if size was clicked
        this.toggleClass(index, attr)
        
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
            } return null
            })         
        } else if (currentProductObj.hasOwnProperty("attributes") && currentProductObj.attributes.every(item => !item.name === "Size"))  {    
            currentProductObj.attributes.push({name: "Size",   value: displayValue})
        }
        this.setState({
            currentProduct: currentProductObj
        }) 
      }
     
           



    /*Choose color of products*/
     chooseColor=(event, index, attr)=>{
       
        let clickedColor = event.target.style.backgroundColor;
        this.toggleClass(index, attr)
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
                    } return null
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
          let item = this.state.data
        
          let attrArray = item.attributes; //Getting an arry of objects with attributes 
          let found = attrArray.find((each)=> each.name === attributeName);

      
           
            if(attributeName === "Capacity") {
                output = found.items.map((each, index) => 
                
                   <div className = {this.setSizeClass(index, attributeName)}  onClick={(event)=>this.chooseCapacity(event,index, attributeName)} key={index}><h3>{each.value}</h3></div>)  
                        
                        return [<h4>{attributeName}</h4>, <div className = {styles.attrBox} key = {attributeName}>{output}</div>]          
            }
            if (attributeName === "Color") { 
                output = found.items.map((each, index) => 
                <div className = {this.setColorClass(index, attributeName)}  onClick={(event)=>this.chooseColor(event, index, attributeName)} key={each.value} style={{backgroundColor: each.value}}>
                    <p>{each.displayValue}</p></div>)    
                      return [<h4>{attributeName}</h4>, <div className = {styles.attrBox} key = {attributeName}>{output}</div>]        
            } 
            if (attributeName === "Size" ) {  
                output = found.items.map((each, index) => 
                   
                   <div className = {this.setSizeClass(index, attributeName)} 
                    onClick={(event)=>this.chooseSize(event,index, attributeName)} id = {index} key={each.value}><h3>{each.value}</h3></div>)    
                     return [<h4>{attributeName}</h4>, <div className = {styles.attrBox} key = {attributeName}>{output}</div>]       
            }
            if (attributeName === "With USB 3 ports" ) {  
              output = found.items.map((each, index) => 
              
                 <div className = {this.setUsbClass(index, attributeName)} onClick={(event)=>this.chooseUSB(event, index, attributeName)} key={each.value}><h3>{each.value}</h3></div>)    
                     return [<h4>{attributeName}</h4>, <div className = {styles.attrBox} key = {attributeName}>{output}</div>]       
            }
             if (attributeName === "Touch ID in keyboard" ) {  
              output = found.items.map((each, index) =>
           
                  <div className = {this.setTouchClass(index, attributeName)} onClick={(event)=>this.chooseTouchId(event, index, attributeName)} key={each.value}><h3>{each.value}</h3></div>)    
                     return [<h4>{attributeName}</h4>, <div className = {styles.attrBox} key = {attributeName}>{output}</div>]       
            } 
      }

   
    
    // Display the price in the product card
     displayPrice=()=> {
        let currentCurrency = this.props.currency;
        let currentCart = this.state.data;
        let currencyItems = this.currencySign;
        return currentCart.prices.map((each)=> {    
            if(each.currency === currentCurrency) {
               return (<p className = {styles.prodInfoPage__price} key={currentCurrency}>
               {currencyItems[currentCurrency]}  {each.amount}</p>)  
            }
           return null
          })
     }
    

     //Setting the images inside the product page
     setImages=()=>{
        let item = this.state.data;
        if (item.gallery.length > 0) {    
            return (
              <div className = {styles.prodDetails__sideImg}>
               {item.gallery.map((each, index)=>{
                return <img src = {each} key = {each} alt = "smyh" onClick={()=>this.changeImg(index)}/>
               })}
              </div>
            )
          };
     }

      //Replaces the big img with the clicked side img 
     changeImg=(indexImg)=> {
        let clickedImg = indexImg
        let item = this.state.data;
        if(item.gallery.length >0) {
         item.gallery.map((each, index)=> {
             if (index === clickedImg) {
                 this.setState({
                     imageSrc: each
                 })
             } return null
         })
        }
     }

   
    render() {
        
      let item = this.state.data; 
      if(!item){
        return (<div className = {styles.prodDetails}></div>)
      }

                  
        return (
            
            <div className = {styles.prodDetails}>
                
                {this.setImages()}
                <div className = {styles.prodDetails__bigImg} >
                    <img src = {!this.state.imageSrc ? item.gallery[0] : this.state.imageSrc} alt = {item.category}/>
                </div>
                <div className = {styles.prodDetails__prodInfo}>
                    <div className = {styles.prodDetails__prodInfo__title}>
                        <h2>{item.brand}</h2>
                        <h3>{item.name}</h3>
                    </div>
                    <div className = {styles.prodDetails__prodInfo__attr}> 
                       {item.attributes.map((each)=> this.setAttribute(each.name) )}   
                    </div>
                    <div className = {styles.prodDetails__prodInfo__price}>
                        <h4>Price: </h4>
                         {this.displayPrice()}
                    </div>
                    <div className = {styles.prodDetails__prodInfo__button}>
                        

                        {item.inStock ? (
                          <button type="button" className = {styles.inStockButton} onClick={this.addToCart}>ADD TO CART</button>
                        ) : <button type="button" className = {styles.outOfStock}>OUT OF STOCK</button>}
                        
                        <div className={styles.desc} dangerouslySetInnerHTML={{__html: item.description}}></div>
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

