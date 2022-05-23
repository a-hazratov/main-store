import React, { PureComponent } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Header from './Components/header';
import Footer from './Components/footer';
import MainLayout from './Components/mainLayout/index';
import ProductDetails from './Components/product-details';
import BigCart from './Components/bigCart';
import Category from './Components/category';
import Sidebar from './Components/sidebar';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import appContext from './Context/appContext';
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
          this.cart = 'cart';
         
          this.state = {
              key: new Date(),
              currency: "USD",
              categories: [],
              cart: [],
              clickedCategory: null,
              counter: 0,
              isOpen: false, // to toggle hamburger menu
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
          this.getDataFromStorage()
          let cart;
          setTimeout(() => {
          cart = this.state.cart
          this.numberOfItems(cart)
          }, 500)  
      }

  // Getting items from local storage
      getDataFromStorage=()=> {  
        if(localStorage[this.cart]) {
            this.setState({
                cart: JSON.parse(localStorage.getItem(this.cart))
            })
        } else { return null} 
     }

  //Function that updates number of items in the cart, to be called in ProductDetails.js and Header.js components
   numberOfItems=(cartToUse) => {
    let number = 0;
    if(cartToUse) {
          cartToUse.map((each)=>number += each.quantity)
           this.setState({
           counter: number
           })
    } else if (!cartToUse) {
        this.setState({
        counter: 0
        })
    }
   }

  //Setting currency for the whole app
   setCurrency=(money)=>{
      let elem = money;
      setTimeout(() => {
         this.setState({
              currency: elem
        })
      }, 0)
   }
   
   //Determine which category was clicked inside Header component
    categoryClick=(e)=>{
       let element =e.target.parentNode;
       let category = element.getAttribute("id");
      this.setState({
        clickedCategory: category,
        isOpen: !this.state.isOpen
      })
    }

    //Toggles the hamburger menu in Hamburger component which is displayed inside Header
    toggleHamburger=()=>{
      this.setState({
          isOpen: !this.state.isOpen
      })
  }

    


  render() {
    let key = this.state.key.getTime()+1;
    let currency = this.state.currency;
    let categories = this.state.categories;
    let clickedCategory = this.state.clickedCategory;
    let counter = this.state.counter;
 
    return (
      <ApolloProvider client={client}>
       <Router>
         <appContext.Provider value = {{state: this.state, toggleHamburger: this.toggleHamburger}}>
            <Header key = {key} numberOfItems = {this.numberOfItems} currency = {currency} 
               setCurrency = {this.setCurrency} categories = {categories} categoryClick={this.categoryClick}
               counter = {counter}/>
            <main className = "mainSection" ref={this.appMain}>

              <Sidebar categories = {categories} categoryClick={this.categoryClick}/>
               
               <Route path = '/' render={(props)=> (<MainLayout {...props} currency = {currency} 
                                                  numberOfItems = {this.numberOfItems}/>)} exact/>
          
                <Route path = '/product/:id' render={(props)=> (<ProductDetails {...props} numberOfItems = {this.numberOfItems} 
                                                            currency = {currency} />)}/>
               
               <Route path = '/shopping-cart' render={(props)=> (<BigCart {...props} currency = {currency} numberOfItems = {this.numberOfItems}/>)}/>
           
               {this.state.categories.map((item)=>(<Route path = {`/${item.name}`} key={item.name} render={(props)=> (<Category {...props} 
                                                currency = {currency} numberOfItems = {this.numberOfItems} 
                                                clickedCategory = {clickedCategory}/>)}/>))}
            </main>
            <Footer/>
        </appContext.Provider>
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

