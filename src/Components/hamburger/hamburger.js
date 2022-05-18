import React, { Component } from 'react';
import styles from './hamburger.module.css';
import appContext from '../../Context/appContext';

export default class hamburger extends Component {
  static contextType = appContext;
    constructor(props) {
        super(props);
        this.state = {}
    }
    
  render() {
    return (
      
        <button className={!this.context.state.isOpen ? styles.hamburger: `${styles.hamburger} ${styles.active}`} onClick = {this.context.toggleHamburger} >
           <div className={styles.bar}></div>
           <div className={styles.bar}></div>
           <div className={styles.bar}></div>
        </button>
        
    )
  }
}

/**className = {!this.state.moneyBoxOpen ? `${styles.select} ${styles.hiddenCurrency}` : styles.select} 
 * !this.props.hamburgerOpen
 */