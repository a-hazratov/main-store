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




 class Category extends PureComponent {
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
      
        return (
            <div>   
                <div className = "mainLayout">
                 <h1>{this.props.clickedCategory}</h1>
                    {this.state.productList.map((item) =>{
                        if(item.category === this.props.clickedCategory) {
                           return (<div className = "mainLayout__items" key = {item.id}>
                                    <SaleItem item = {item}  inStock = {item.inStock} 
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

export default graphql(getProducts)(Category);