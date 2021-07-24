import React, { Component } from 'react'
//import {Link, withRouter} from 'react-router-dom'
import { gql } from "apollo-boost";
import {graphql} from 'react-apollo';
import replicaOfData from './replicaOfData.json'

const getProducts = gql`
{
    category {
        products {
            id
            name
            inStock
            gallery   
            category  
            description
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
    }
}
`



class ProductDetails extends Component {
    constructor (props) {
        super(props);
        
        this.chooseCapacity = this.chooseCapacity.bind(this);
        
        this.cartStorage = 'cart';
        
        this.state = {
            onceClickedSize: "prodDetails__prodInfo__size clickedSizeBox",  
            onceClickedColor: "prodDetails__prodInfo__color clickedColorBox", 
            data: [],
            storageName : 'productStorage',
            currentProduct: {}
        
        }

        this.product = this.state.data.find((each) => each.id === this.props.match.params.id)
    }

     
    
    componentDidMount() {
        console.log("Mounted");
        setTimeout(() => {
            console.log("Data is fetched", this.props.data.category.products);
            this.setState({
                data: [...this.props.data.category.products]
            })
        }, 1000)
    }

   
    
    

    //Add products to localStorage and the shopping cart
    addToCart =()=>{
        let product = this.state.data.find((each) => each.id === this.props.match.params.id)
        console.log("Adding to cart button")
        if(!localStorage[this.cartStorage]) {
            localStorage[this.cartStorage] = JSON.stringify([]);          
        }

        let cartArray = JSON.parse(localStorage[this.cartStorage]);
       
        let currentProductObj = this.state.currentProduct;
            currentProductObj.id = product.id;
            currentProductObj.name =   product.name; 
            currentProductObj.quantity = 1;  
        //Generate s unique key based on attributes selected    
        let uKey = null;
        let keyAttritutes = [];
        if(currentProductObj.attributes) {
            for (let i = 0; i < currentProductObj.attributes.length; i++) {
                keyAttritutes.push("_"+currentProductObj.attributes[i].name+"-"+currentProductObj.attributes[i].value)
            }
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
                 console.log("the same attribute chosen")
                 cartArray.map((item) => {
                     if(item.uKey === uKey) {
                         item.quantity += 1
                     }
                 })
              } 
        }
        //End of adding products to cartArray or increment quantity

        //Check if the product has attributes and they have been selected ???
        
         localStorage[this.cartStorage] = JSON.stringify(cartArray)
        this.props.numberOfItems(cartArray)
         cartArray = []
         this.removeStyles()
        this.setState({
             currentProduct: {}
        })
        
        //Removing styles from the page after the addToCart button is clicked
        
        
         
    }

        /**Remove styles from clicked attributes on product page */
         removeStyles=()=> {
            let capacitySizeStyleRemove = document.querySelector(".clickedSizeBox");
            let colorStyleToRemove = document.querySelector(".clickedColorBox");
            if(capacitySizeStyleRemove) {
                capacitySizeStyleRemove.classList.remove("clickedSizeBox");
            } else if (colorStyleToRemove) {
                colorStyleToRemove.classList.remove("clickedColorBox")
            }  
         }

       /*Choose capacity of a product*/
    chooseCapacity(event){ 
        //Setting indicators if size was clicked
        let onceClickedAttr = this.state.onceClickedSize
        let allSizes = document.querySelectorAll(".prodDetails__prodInfo__size")
        allSizes.forEach((size)=> {
            if(size.getAttribute("class") === onceClickedAttr ) {
                size.classList.remove("clickedSizeBox")
            } else if (size === event.target.parentNode) {
                size.classList.add("clickedSizeBox")
            }
        })
        // setting the right size in the shopping cart
        //let item = this.state.data.find((each) => each.id === this.props.match.params.id)
        let displayValue = event.target.textContent;
        let currentProductObj = this.state.currentProduct;
        // currentProductObj.id = this.product.id;
         console.log(event.target)
        if(!currentProductObj.hasOwnProperty("attributes")) {
            currentProductObj.attributes = [];
            currentProductObj.attributes.push({name: "Capacity", value: displayValue})
            console.log("new array attributes created and object inserted")
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
     
    /** Choose size of the product */
    chooseSize=(event)=>{ 
        //Setting indicators if size was clicked
        let onceClickedAttr = this.state.onceClickedSize
        let allSizes = document.querySelectorAll(".prodDetails__prodInfo__size")
        allSizes.forEach((size)=> {
            if(size.getAttribute("class") === onceClickedAttr ) {
                size.classList.remove("clickedSizeBox")
            } else if (size === event.target.parentNode) {
                size.classList.add("clickedSizeBox")
            }
        })
        // setting the right size in the shopping cart
        //let item = this.state.data.find((each) => each.id === this.props.match.params.id)
        let displayValue = event.target.textContent;
        let currentProductObj = this.state.currentProduct;
        // currentProductObj.id = this.product.id;
         console.log(event.target)
        if(!currentProductObj.hasOwnProperty("attributes")) {
            currentProductObj.attributes = [];
            currentProductObj.attributes.push({name: "Size", value: displayValue})
            console.log("new array attributes created and object inserted")
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
            console.log("last option")
        }
        this.setState({
            currentProduct: currentProductObj
        }) 

    }
     
           



    /*Choose color of products*/
    chooseColor=(event)=>{
        let onceClickedAttr = this.state.onceClickedColor
        let clickedColor = event.target.textContent;
        
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
            console.log("Attributes did not exist, created and added color attr")
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
        } else if (currentProductObj.hasOwnProperty("attributes") && currentProductObj.attributes.length == 0) {
            currentProductObj.attributes.push({name: "Color", value: clickedColor})
        }    
       
        this.setState({
            currentProduct: currentProductObj
        })   
    }
    


    //Setting attributes and attribute names of the product
     setAttribute=(attributeName)=> {
          let output = null;
          let item = this.state.data.find((each) => each.id === this.props.match.params.id)
        
          
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
      }
      
     
   
    render() {
        console.log(this.props.name)
        let item = this.state.data.find((each) => each.id === this.props.match.params.id)
       
        if(!item){
            return (
            
                <div className = "prodDetails"></div>
            )
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
                console.log(clickedImg, newPlace.src)
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
                           <h2>{item.name}</h2>
                    </div>
                    <div>
                            
                             {item.attributes.map((each)=> this.setAttribute(each.name) )}
                        
                    </div>
                    <div className = "prodDetails__prodInfo__price">
                        <h4>Price: </h4>
                        <h4>{item.prices[0].currency}   {item.prices[0].amount}</h4>
                    </div>
                    <div className = "prodDetails__prodInfo__button">
                        <button type="button" onClick={this.addToCart}>ADD TO CART</button>
                        <p>{item.description}</p>

                    </div>
                </div>
                
            </div>
        )
    }
}

export default graphql(getProducts)(ProductDetails);



/** rgbToHex=(r, g, b)=> {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
          } */

          /**localStorage[this.cartStorage] = JSON.stringify(cartArray)
             cartArray = [] */