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
            data: replicaOfData.data.category.products,
            
            shoppingCart: [],
            currentProduct: {}
        }
    }

  
    //Add products to the shopping cart
         addToCart =()=>{
             console.log("Adding to cart button")
          let currentProductObj = this.state.currentProduct
        
        if(!currentProductObj.hasOwnProperty('attribute')) {
            currentProductObj.attribute = {size: "L"}
        }
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
        }
     
    
            rgbToHex=(r, g, b)=> {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
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
       
        console.log( typeof(clickedColor.toString()))
     }
    
    //Setting attributes and attribute names of the product
     setAttribute=(attributeName)=> {
          let output = null;
          let item = this.state.data.find((each) => each.id === this.props.match.params.id)
        
          console.log("setAttribute function is called")
          let attrArray = item.attributes;
          let found = attrArray.find((item)=> item.name === attributeName)

         if(attributeName === "Capacity") {
              output = found.items.map((each) => 
              <div className = "prodDetails__prodInfo__size" onClick={this.chooseSize}><h4>{each.value}</h4></div>)    
              return [<h4>{attributeName}</h4>, output]          
          }
          if (attributeName === "Color") { 
              output = found.items.map((each) => 
              <div className = "prodDetails__prodInfo__color"  onClick={this.chooseColor} style={{backgroundColor: each.value}}></div>)    
               return [<h4>{attributeName}</h4>, output]        
          } 
          if (attributeName === "Size" ) {  
              output = found.items.map((each) => 
              <div className = "prodDetails__prodInfo__size" onClick={this.chooseSize}><h4>{each.value}</h4></div>)    
               return [<h4>{attributeName}</h4>, output]       
          }
      }
      
     
   
    render() {
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


