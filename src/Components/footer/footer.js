import React, { PureComponent } from 'react'
import styles from './footer.module.css';

export default class Footer extends PureComponent {
    render() {
        return (
            <div className = {styles.footer}>
                <h6>Created by Artur Hazratov | Copyright 2022 &copy; Your Shop</h6>
            </div>
        )
    }
}
