import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import MainLayout from './Layouts/MainLayout';
import ProductDetails from './Components/ProductDetails';

import Clothes from './Layouts/Clothes';
import Tech from './Layouts/Tech';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';


const client = new ApolloClient({
  uri:'http://localhost:4000'
})


export default class App extends Component {
  constructor(props) {
    super(props);
     
     this.state = {
        name: "Artur"
     }
  }
 
  //Function that updates number of items in cart, to be called in ProductDetail and Header components
  numberOfItems=(cartToUse) => {
    let number = 0
    let counter = document.querySelector(".counter")
    let smallCartCounter = document.querySelector(".smallCartCounter")
    cartToUse.map((eact)=>number += eact.quantity)
    return [counter.textContent= number, smallCartCounter.textContent = number+" items"]
}
  
    

  render() {
    return (
      <ApolloProvider client={client}>
       <Router>
        <Header name = {this.state.name}/>
        <main className = "mainSection">
          <Route path = '/' component = {MainLayout} exact/>
          <Route path = '/clothes' component = {Clothes}/>
          <Route path = '/tech' component = {Tech}/>
          <Route path = '/product/:id' render={(props)=> (<ProductDetails {...props} numberOfItems = {this.numberOfItems}/>)}/>
           <Route path = '/clothes/product/:id' render={(props)=> (<ProductDetails {...props} numberOfItems = {this.numberOfItems}/>)} />
          <Route path = '/tech/product/:id' render={(props)=> (<ProductDetails {...props} numberOfItems = {this.numberOfItems}/>)} />
         
         
        </main>
        <Footer/>
      </Router>
    </ApolloProvider>
    )
  }
}

/**component = {withRouter(ProductDetails)} */


