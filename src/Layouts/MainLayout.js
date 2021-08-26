import React, { Component } from 'react';
import SaleItem from '../Components/SaleItem';
import { gql } from "apollo-boost";
import { graphql} from 'react-apollo';

const getProducts = gql`
{
    category {
        products {
            id
            name
            inStock
            gallery   
            category 
            prices  {
                currency
                amount
            }           
        }
    }
}
`

class MainLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productList: [],
            
        }
    }
    
     getData() {
        setTimeout(() => {
            this.setState({
                productList: [...this.props.data.category.products]
            })
        }, 1000)
     }

    componentDidMount() {
       this.getData()
    }
        
    
    render() {
        let currency = this.props.currency
       console.log("The main layout item added " + this.props.numberOfItems)
        //Styles for the heading
        const styleTitle = {
        width: '100%',
        paddingLeft: '50px', 
        }
         
     
        return (
           
             <div>
                  <div className = "mainLayout">
                    <h1 style = {styleTitle}>ALL ITEMS</h1>

                    {this.state.productList.length > 0 && (this.state.productList.map(item => (
                        <div className = "mainLayout__items">
                            <SaleItem item = {item} inStock={item.inStock} 
                            currency = {currency} numberOfItems = {this.props.numberOfItems}/>
                        </div>
                    )))}

                </div>            
            </div>
        
        )
    }
  }


export default graphql(getProducts)(MainLayout);
