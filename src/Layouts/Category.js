import React, { PureComponent } from 'react';
import SaleItem from '../Components/SaleItem';
import { gql } from "apollo-boost";
import {graphql} from 'react-apollo';

const getProducts = gql`
{
    category {
          products  {
              id 
              name
              inStock
              gallery   
              category 
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
      }
  }
  `




 class Clothes extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            productList: [],
        }
    }
    
    getData() {
        setTimeout(() => {
            this.setState({
                productList: this.props.data.category.products
            })         
        }, 1000)
    };
    
    componentDidMount() {
        this.getData()   
    }
    
    render() {
     
        let currency = this.props.currency
        let numberOfItems = this.props.numberOfItems
        //Styles for the heading
        const styleTitle = {
        width: '100%',
        paddingLeft: '50px', 
        textTransform: 'uppercase',
        fontFamily: "Raleway"
        }
        return (
            <div>   
                <div className = "mainLayout">
                 <h1 style = {styleTitle}>{this.props.clickedCategory}</h1>
                    {this.state.productList.map((item) =>{
                        if(item.category === this.props.clickedCategory) {
                           return (<div className = "mainLayout__items">
                                    <SaleItem item = {item} inStock = {item.inStock} 
                                    currency = {currency} numberOfItems = {numberOfItems}/>
                                 </div>)
                        } return null
                    }
                    )}
                </div>            
            </div>
        )
    }
}

export default graphql(getProducts)(Clothes);