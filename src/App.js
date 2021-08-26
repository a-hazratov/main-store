import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import MainLayout from './Layouts/MainLayout';
import ProductDetails from './Components/ProductDetails';
import BigCart from './Layouts/BigCart';
import Clothes from './Layouts/Clothes';
import Tech from './Layouts/Tech';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';


const client = new ApolloClient({
  uri:'http://localhost:4000',
  cache: new InMemoryCache()
});


export default class App extends Component {
  constructor(props) {
        super(props)
      
   
      this.state = {
           key: new Date(),
           currency: "USD"
      
      }
  } 
 
  //Function that updates number of items in the cart, to be called in ProductDetails.js and Header.js components
   numberOfItems=(cartToUse) => {
    let number = 0
    let counter = document.querySelector(".counter")
    let smallCartCounter = document.querySelector(".smallCartCounter")
    cartToUse.map((eact)=>number += eact.quantity)
    return [counter.textContent= number, smallCartCounter.textContent = number+" items"]
   }

  //Setting currency for the whole app
   setCurrency=(money)=>{
      let elem = money;
      console.log("SetCurrency function is running")
      setTimeout(() => {
         this.setState({
              currency: elem
        })
      }, 0)
   }
   
    

  render() {
    let key = this.state.key.getTime()+1;
    let currency = this.state.currency;
    
    return (
      <ApolloProvider client={client}>
       <Router>
        <Header key = {key} numberOfItems = {this.numberOfItems} currency = {currency} setCurrency = {this.setCurrency}/>
        <main className = "mainSection" ref={this.appMain}>
           <Route path = '/' render={(props)=> (<MainLayout {...props} currency = {currency} numberOfItems = {this.numberOfItems}/>)} exact/>
           <Route path = '/clothes' render={(props)=> (<Clothes {...props} currency = {currency} numberOfItems = {this.numberOfItems}/>)}/>
           <Route path = '/tech' render={(props)=> (<Tech {...props} currency = {currency} numberOfItems = {this.numberOfItems}/>)}/>
           <Route path = '/product/:id' render={(props)=> (<ProductDetails {...props} numberOfItems = {this.numberOfItems} currency = {currency}/>)}/>
           <Route path = '/clothes/product/:id' render={(props)=> (<ProductDetails {...props} currency = {currency} numberOfItems = {this.numberOfItems}/>)} />
           <Route path = '/tech/product/:id' render={(props)=> (<ProductDetails {...props} currency = {currency} numberOfItems = {this.numberOfItems}/>)} />
          <Route path = '/shopping-cart' render={(props)=> (<BigCart {...props} currency = {currency}  numberOfItems = {this.numberOfItems}/>)}/>
         
        </main>
        <Footer/>
      </Router>
    </ApolloProvider>
    )
  }
}


