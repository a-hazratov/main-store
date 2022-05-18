import React, { PureComponent } from 'react';
import {Link} from 'react-router-dom'
import styles from './sidebar.module.css';
import appContext from '../../Context/appContext';

export default class Sidebar extends PureComponent {
  static contextType = appContext;
    constructor(props) {
        super(props)
        this.state = {
            clickedCategory: null,
          
        }
      } 
  render() {
    const {isOpen} = this.context.state;
    const {toggleHamburger} = this.context;
    return (
      <div className = {!isOpen ? styles.sidebar_main : `${styles.sidebar_main} ${styles.open}`}>
         <ul className = {styles.sidebar_ul}>
             <li onClick = {toggleHamburger}><Link to = "/">ALL ITEMS</Link></li>
             {this.props.categories.map((each)=>(
              <li key={each.name} id={each.name} >
               <Link to= {`/${each.name}`} onClick={this.props.categoryClick}>{each.name.toUpperCase()}</Link>
               </li>
             ))}
         </ul>

      </div>
    )
  }
}

/*
<div className= {styles.header__navbar__category}>
<div className={styles.header__navbar__category__item}>
    <Link to="/">ALL ITEMS</Link>
</div>
 {this.props.categories.map((each)=>(
      <div className={styles.header__navbar__category__item} key={each.name} id={each.name} >
         <Link to= {`/${each.name}`} onClick={this.props.categoryClick}>{each.name.toUpperCase()}</Link>
      </div>
 ))}

                     
</div>
*/