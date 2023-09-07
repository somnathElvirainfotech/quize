import React from 'react'
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

function Footer() {
  return (
    <>
      <footer>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-5">
              <div className="footer-left">
                <a href="/" className="ftr-logo">
                  <img src={logo} alt="logo" className="footer-logo" />
                </a>
                <address>
                  8 Marina Boulevard, Level 11 Marina Bay Financial Centre, Singapore
                  018981
                </address>
              </div>
            </div>
            <div className="col-md-7 mt-4 mt-md-0">
              <div className="footer-right">
                <ul>
                  <li>
                    <a href="#">Terms &amp; Conditions</a>
                  </li>
                  <li>
                    <a href="#">Privacy Privacy </a>
                  </li>
                  <li>
                    <a href="#">Sitemap</a>
                  </li>
                  <li>
                    <a href="#">Refund Policy</a>
                  </li>
                </ul>
                <p className="copy-right">
                  CMFAS Academy - Copyright © 2023. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </>
  )
}

export default Footer