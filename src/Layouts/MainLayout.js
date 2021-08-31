import React, { PureComponent } from 'react';
import SaleItem from '../Components/SaleItem';
import { gql } from "apollo-boost";
import { graphql} from 'react-apollo';

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

class MainLayout extends PureComponent {
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
        let currency = this.props.currency;
         
        return (
           
             <div>
                  <div className = "mainLayout">
                    <h1>ALL ITEMS</h1>

                    {this.state.productList.length > 0 && (this.state.productList.map(item => (
                        <div className = "mainLayout__items">
                            <SaleItem item = {item} key = {item.id} inStock={item.inStock} 
                            currency = {currency} numberOfItems = {this.props.numberOfItems}/>
                        </div>
                    )))}

                </div>            
            </div>
        
        )
    }
  }


export default graphql(getProducts)(MainLayout);
