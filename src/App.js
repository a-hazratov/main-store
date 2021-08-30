import React, { PureComponent } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import MainLayout from './Layouts/MainLayout';
import ProductDetails from './Components/ProductDetails';
import BigCart from './Layouts/BigCart';
import Category from './Layouts/Category';
//import Tech from './Layouts/Tech';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import { gql } from "apollo-boost";
import { graphql} from 'react-apollo';


const client = new ApolloClient({
  uri:'http://localhost:4000',
  cache: new InMemoryCache()
});

const itemCategories = gql`
     {
       categories {
         name
       }
     }
`
    class App extends PureComponent {
        constructor(props) {
          super(props)
          this.state = {
              key: new Date(),
              currency: "USD",
              categories: [],
              clickedCategory: null
          }
        } 
  
        getCategories() {
          setTimeout(() => {
              this.setState({
                  categories: this.props.data.categories
              })       
          }, 1000)
      };
      
      componentDidMount() {
          this.getCategories() 
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
   
   //Determine which category was clicked inside Header component
    categoryClick=(e)=>{
      let element =e.target.parentNode;
      let category = element.getAttribute("id")
      console.log(category)
      this.setState({
        clickedCategory: category
      })
    }

  render() {
    let key = this.state.key.getTime()+1;
    let currency = this.state.currency;
    let categories = this.state.categories;
    let clickedCategory = this.state.clickedCategory;
    console.log( this.props.data.categories)
    return (
      <ApolloProvider client={client}>
       <Router>
        <Header key = {key} numberOfItems = {this.numberOfItems} currency = {currency} 
          setCurrency = {this.setCurrency} categories = {categories} categoryClick={this.categoryClick}/>
        <main className = "mainSection" ref={this.appMain}>
           <Route path = '/' render={(props)=> (<MainLayout {...props} currency = {currency} 
                                                  numberOfItems = {this.numberOfItems}/>)} exact/>
          
           <Route path = '/product/:id' render={(props)=> (<ProductDetails {...props} numberOfItems = {this.numberOfItems} 
                                                            currency = {currency} />)}/>
           <Route path = '/clothes/product/:id' render={(props)=> (<ProductDetails {...props} currency = {currency} 
                                                                   numberOfItems = {this.numberOfItems}/>)} />
           <Route path = '/tech/product/:id' render={(props)=> (<ProductDetails {...props} currency = {currency}
                                                                   numberOfItems = {this.numberOfItems}/>)} />
          <Route path = '/shopping-cart' render={(props)=> (<BigCart {...props} currency = {currency} numberOfItems = {this.numberOfItems}/>)}/>
           
          {this.state.categories.map((item)=>(<Route path = {`/${item.name}`} render={(props)=> (<Category {...props} 
                                                currency = {currency} numberOfItems = {this.numberOfItems} 
                                                clickedCategory = {clickedCategory}/>)}/>))}
        </main>
        <Footer/>
      </Router>
    </ApolloProvider>
    )
  }
}

export default graphql(itemCategories, {
  options:(props)=> {
    return {
      client
    }
  }
})(App);


/** <Route path = '/clothes' render={(props)=> (<Clothes {...props} currency = {currency} numberOfItems = {this.numberOfItems}/>)}/>
    <Route path = '/tech' render={(props)=> (<Tech {...props} currency = {currency} numberOfItems = {this.numberOfItems}/>)}/> */