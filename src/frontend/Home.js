// Home.js
import React from "react";
import { Link } from "react-router-dom";
import "../style/home.css";
import logo from "../picture/Praha-gem.png"; // Importe ton logo

function Home() {
  return (
    <div className="container">
      <div className="section_1"></div>
      <div className="section_2"></div>
      <div className="section_3">
        <div className="section_3_partion_1">
          <div className="partition_1_head">
            <div className="logo_container">
              <img className="logo" src={logo} alt="Praha Gems Logo" />
            </div>

          </div>
          <div className="text_container">
            <h1>Welcome to Praha Gems!</h1>
            <p>"Praha Gems" is your online pocket guide to discovering the hidden treasures of Prague.</p>
            <p>Discover cozy cafes, panoramic viewpoints, and more.</p>
            <p>You can subscribe to suggest addresses.</p>
          </div>
        </div>
        <div className="section_3_partion_2">
          <div className="carts_container">
            <div className="cart cart_1">
              <div className="cart_image cart_image_1"></div>
            </div>
            <div className="cart cart_1">
              <div className="cart_image cart_image_2"></div>
            </div>
            <div className="cart cart_1">
              <div className="cart_image cart_image_3"></div>
            </div>
          </div>
        </div>
      </div>
      <Link to="/login">
      <button className="button-animated">Login</button>      </Link>
    </div>
  );
}

export default Home;
