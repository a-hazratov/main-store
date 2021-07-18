import React, { Component } from 'react';
import SaleItem from '../Components/SaleItem';
import { gql } from "apollo-boost";
import {graphql} from 'react-apollo';

const getProducts = gql`
{
    category {
        products {
            id
            name
            inStock
            gallery   
            category        
        }
    }
}
`

class Tech extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productList: []
        }
    }
    
    getData() {
        setTimeout(() => {
            console.log("Data is fetched");
            this.setState({
                productList: this.props.data.category.products
            })       
        }, 1000)
    };
    
    componentDidMount() {
        this.getData() 
    }
    render() {
        
        //Styles for the heading
        const styleTitle = {
        width: '100%',
        paddingLeft: '50px', 
        }
        return (
            <div>
                <div className = "mainLayout">
                <h1 style = {styleTitle}>TECH STUFF</h1>
                    {this.state.productList.map(function(item) {
                        if(item.category === "tech") {
                         return (<div className = "mainLayout__items">
                            <SaleItem item = {item}/>
                        </div>)
                        }
                    } 
                    )}
                </div>     
                 
            </div>
        )
    }
}

export default graphql(getProducts)(Tech);