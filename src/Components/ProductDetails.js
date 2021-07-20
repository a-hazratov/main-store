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
        }
    }
}
`



 class ProductDetails extends Component {
    constructor (props) {
        super(props);
        this.chooseSize = this.chooseSize.bind(this)
        this.state = {
            onceClickedSize: "prodDetails__prodInfo__size clickedSizeBox",  
            onceClickedColor: "prodDetails__prodInfo__color clickedColorBox", 
            data: [],
            
            shoppingCart: [],
            currentProduct: {}
        }
    }

    getData() {
        setTimeout(() => {
            console.log("Data is fetched");
            this.setState({
                data: [...this.props.data.category.products]
            })
        }, 1000)
    }
    
    componentDidMount() {
        this.getData()
    }

    //Add products to the shopping cart
         addToCart =()=>{
            let item = this.state.data.find((each) => each.id === this.props.match.params.id)
             console.log("Adding to cart button")
          let currentProductObj = this.state.currentProduct
              currentProductObj.id = item.id;
              currentProductObj.name = item.name;
              currentProductObj.inStock = item.inStock;
              currentProductObj.gallery = item.gallery;
              currentProductObj.category = item.category;
              currentProductObj.prices = item.prices;
        
         this.setState({
            currentProduct: currentProductObj
          })
   
       }


       /*Choose size or capacity of a product*/
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
            let item = this.state.data.find((each) => each.id === this.props.match.params.id)
            let displayValue = event.target.textContent;
            let currentProductObj = this.state.currentProduct;
            if(!currentProductObj.hasOwnProperty("attributes") && item.category === "tech") {
                currentProductObj.attributes = [];
                currentProductObj.attributes.push({name: "Capacity", items: [{displayValue: displayValue, value: displayValue}]})
                console.log("new array attributes created and object inserted")
            } else if (currentProductObj.hasOwnProperty("attributes") && currentProductObj.attributes.length > 0) {
                currentProductObj.attributes.map((each)=> {
                    let index = currentProductObj.attributes.indexOf(each);
                if(each.name === "Capacity" && each.items[0].displayValue === displayValue)  {
                    currentProductObj.attributes.splice(index, 1);
                    console.log("Capacity exists, the clicked button is the same, we remove the object")
                } else if(each.name === "Capacity" && each.items[0].displayValue !== displayValue) {
                    currentProductObj.attributes.splice(index, 1);
                    currentProductObj.attributes.push({name: "Capacity", items: [{displayValue: displayValue, value: displayValue}]})
                    console.log("capacity exists, new box clicked")
                } 
                })         

            } else if (currentProductObj.hasOwnProperty("attributes") && currentProductObj.attributes.every(item => !item.name === "Capacity"))  {
                
                    currentProductObj.attributes.push({name: "Capacity", items: [{displayValue: displayValue, value: displayValue}]})
                    console.log("last option")
            }
            this.setState({
                currentProduct: currentProductObj
            }) 

        }
     
    
           



    /*The functions  controls the boxes colors*/
      chooseColor=(event)=>{
        let onceClickedAttr = this.state.onceClickedColor
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
            currentProductObj.attributes.push({name: "Color", items: [{displayValue: "", value: clickedColor}]})
        } else if (currentProductObj.hasOwnProperty("attributes")) {
            currentProductObj.attributes.map((each)=> {   
               if(each.name === "Color")  {
                let index = currentProductObj.attributes.indexOf(each);
                currentProductObj.attributes.splice(index, 1);
                currentProductObj.attributes.push({name: "Color", items: [{displayValue: "", value: clickedColor}]})
               console.log(index)
               }
            })         

        }
        /*
        //new method
        let item = this.state.data.find((each) => each.id === this.props.match.params.id)
        
        let currentProductObj = this.state.currentProduct;
     if(!currentProductObj.hasOwnProperty("attributes") && item.category === "clothes") {
         currentProductObj.attributes = [];
         currentProductObj.attributes.push({name: "Color", items: [{displayValue: "", value: clickedColor}]})
         console.log("new array attributes created and object inserted")
     } else if (currentProductObj.hasOwnProperty("attributes") && currentProductObj.attributes.length > 0) {
         currentProductObj.attributes.map((each)=> {
             let index = currentProductObj.attributes.indexOf(each);
            if(each.name === "Color" && clickedColor === )  {
             currentProductObj.attributes.splice(index, 1);
             console.log("Capacity exists, the clicked button is the same, we remove the object")
          } else if(each.name === "Capacity" && each.items[0].displayValue !== displayValue) {
             currentProductObj.attributes.splice(index, 1);
             currentProductObj.attributes.push({name: "Capacity", items: [{displayValue: displayValue, value: displayValue}]})
             console.log("capacity exists, new box clicked")
          } 
         })         

       } else if (currentProductObj.hasOwnProperty("attributes") && currentProductObj.attributes.every(item => !item.name === "Capacity"))  {
         
             currentProductObj.attributes.push({name: "Capacity", items: [{displayValue: displayValue, value: displayValue}]})
             console.log("last option")
      }
        //end of new method*/
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
              <div className = "prodDetails__prodInfo__size" onClick={this.chooseSize}><h4>{each.value}</h4></div>)    
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
        console.log(this.state.currentProduct)
        let item = this.state.data.find((each) => each.id === this.props.match.params.id)
       
                    
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