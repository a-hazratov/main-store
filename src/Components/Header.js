import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export default class Header extends Component {
    render() {
        return (
            <div>
                <div className="header">
                    <nav className = "header__navbar">
                       <div className="header__navbar__category">
                           <div className="header__navbar__category__item">
                               <Link to="/">ALL ITEMS</Link>
                           </div>
                           <div className="header__navbar__category__item">
                               <Link to="/clothes">CLOTHES</Link>
                            </div>
                           <div className="header__navbar__category__item">
                                <Link to="/tech">TECH</Link>
                            </div>                         
                           
                        </div>

                         <div className = "header__navbar__bag">
                             <Link to = "/"><img src="https://icons.iconarchive.com/icons/petalart/free-shopping/48/shopping-bag-icon.png" alt="Shopping bag"/></Link>
                         </div>

                         <div className = "header__navbar__links">
                             <Link to="#"><img src="https://icons.iconarchive.com/icons/iconsmind/outline/24/Dollar-Sign-2-icon.png" alt="dollar sign"/>
                               <img src="https://icons.iconarchive.com/icons/icons8/ios7/16/Arrows-Down-4-icon.png" alt="Dropdown arrow"/></Link>
                            <Link to="#"><img src="https://icons.iconarchive.com/icons/iconsmind/outline/32/Shopping-Cart-icon.png" alt="Shopping cart"/></Link>
                         </div>

                    </nav>

                </div>
            </div>
        )
    }
}
