import React from 'react'
import './Navigation.css'

const Navigation = () => {
  return (
    <nav className = "container">
    <div className = "logo">
      <img  src =  './src/components/Navigation/logo.png'/>
      </div>
      <ul>
        <li href = "#">Menu</li>
        <li href = "#">Services</li>
        <li href = "#">About</li>
        <li href = "#">Contact Us</li>
      </ul>
     
    
      <button class="login-button">Login</button>

        </nav>
   );
}

export default Navigation


