import React, { Component } from 'react';
import {BrowserRouter as Router, Route, withRouter} from 'react-router-dom';
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
        
     }
  }

  
    

  render() {
    return (
      <ApolloProvider client={client}>
       <Router>
        <Header/>
        <main className = "mainSection">
          <Route path = '/' component = {MainLayout} exact/>
          <Route path = '/clothes' component = {Clothes}/>
          <Route path = '/tech' component = {Tech}/>
          <Route path = '/product/:id' component = {withRouter(ProductDetails)}/>
          <Route path = '/clothes/product/:id' component = {ProductDetails}/>
          <Route path = '/tech/product/:id' component = {ProductDetails}/>
         
        </main>
        <Footer/>
      </Router>
    </ApolloProvider>
    )
  }
}



