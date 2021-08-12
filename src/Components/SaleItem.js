import React, { Component } from 'react'
import {Link} from 'react-router-dom'


export default class SaleItem extends Component {
    constructor (props) {
        super(props);
        this.state = {

        }
       
    }


    // Display the price in the product card
    displayPrice=()=> {
        let currentCurrency = this.props.currency;
        let currentCart = this.props.item;
        let price = currentCart.prices.map((each) => {
            if(each.currency === currentCurrency) {
                return each.amount
            }
        })
        
         return [currentCurrency, price]
    }

    render() {
  

         //Start of styling for product card
         const productCardStyle={
           width: '386px',
           height: '444px',
           padding: '16px',
           marginTop: '5px'
         }

         const imageStyle = {
            width: '354px',
            height: '330px',
            objectFit: 'contain'
         }

         const productDesc = {
             width: '354px',
             height: '58px',
             color: 'black',
             lineHeight: '0.7rem'
         }
         //End of styling for product card

        return (
            <div className = "productCard" style = {productCardStyle}>
                <Link to = {`/product/${this.props.item.id}`}>
                    <div>
                        <img src = {this.props.item.gallery[0]} alt = "sale product" style = {imageStyle}/>
                    </div>

                    <div className = "productCard__bottom" style = {productDesc}>
                        <p>{this.props.item.name}</p>
                        <p style = {{fontFamily: "Times New Roman"}}>{this.displayPrice()}</p>
                    </div>
                </Link>
            </div>
        )
    }
}
