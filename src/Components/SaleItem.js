import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import './ComStyles/SaleItemStyle.css'


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
  

        return (
            <div className = "productCard">
                <Link to = {`/product/${this.props.item.id}`}>
                    <div>
                        <img src = {this.props.item.gallery[0]} alt = "sale product"/>
                    </div>

                    <div className = "productCard__bottom">
                        <p>{this.props.item.name}</p>
                        <p style = {{fontFamily: "Times New Roman"}}>{this.displayPrice()}</p>
                    </div>
                </Link>
            </div>
        )
    }
}
