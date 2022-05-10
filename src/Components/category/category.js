import React, { PureComponent } from 'react';
import SaleItem from '../saleitem';
import styles from './category.module.css';
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
            category: null
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

    componentDidUpdate() {
       this.getData();
        if(!localStorage.getItem('category')) {
           localStorage.setItem('category', this.props.clickedCategory)
        } else if (localStorage.getItem('category') && this.props.clickedCategory !== null) {
           localStorage.setItem('category', this.props.clickedCategory)
        }
        this.setState({
            category: localStorage.getItem('category')
        })
      }
    
    render() {
        let currency = this.props.currency
        let numberOfItems = this.props.numberOfItems
        let category = this.state.category
      
        return (
            <div>   
                <div className = {styles.mainLayout}>
                 <h1>{this.props.clickedCategory || category}</h1>
                    {this.state.productList.map((item) => {
                              if(item.category === this.props.clickedCategory) {
                                  return (<div className = {styles.mainLayout__items} key = {item.id}>
                                 <SaleItem item = {item}  inStock = {item.inStock} 
                                 currency = {currency} numberOfItems = {numberOfItems}/>
                              </div>)
                     } else if(item.category === category) {
                              return (<div className = {styles.mainLayout__items} key = {item.id}>
                                     <SaleItem item = {item}  inStock = {item.inStock} 
                                       currency = {currency} numberOfItems = {numberOfItems}/>
                                      </div>)
                     }  return null
                    }
                    )}
                </div>            
            </div>
        )
    }
}

export default graphql(getProducts)(Category);

