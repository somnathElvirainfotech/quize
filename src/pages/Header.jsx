import React, { useEffect, useState } from "react";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Image,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import TokenHelper from "./TokenHelper";
import userService from "../services/user.service";

import { LinkContainer } from "react-router-bootstrap";
import { Link,NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/images/logo.png";
import { AuthContext } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../redux/auth";
import LoginPage from "./LoginPage";

function Header() {
  const { isAuthenticated, user_id, user_data } = useSelector(
    (state) => state.auth
  );
  var navigate = useNavigate();
  const dispatch = useDispatch();

  // const [loginPageModal, setLoginPageModal] = useState(false);
  // const loginPageModalClose = () => setLoginPageModal(false);
  // const loginPageModalShow = () => setLoginPageModal(true);

  // const {user}=useContext(AuthContext);
  // const {user,dispatch} = useContext(userContext);
  //  console.log(user)
  const Logout = () => {
    // localStorage.clear();
    // sessionStorage.clear();
    // dispatch({type:"reset",valuse:""});
    // localStorage.clear();
    // setIsLoggedIn(true);
    dispatch(authActions.Logout());
    navigate("/");
    // window.location.reload();
    // toast.success("Logout Successfully");
  };

  // console.log(user,'user')
  return (
    <>
      <header>
        <div className="nav-area container">
          <div className="cover-nav">
            <div className="logo">
              <NavLink to="/">
                <img src={logo} alt="logo" className="footer-logo" />
              </NavLink>
            </div>
            <a href="javascript:void(0)" id="pull">
              <div className="hamburger hamburger--spring">
                <div className="hamburger-box">
                  <div className="hamburger-inner" />
                </div>
              </div>
            </a>
            <div className="nav">
              <ul id="menu-bg">
                <li>
                  <NavLink to="/">home</NavLink>
                </li>
                {isAuthenticated && <li>
                  <NavLink to="/bookmark">bookmark</NavLink>
                </li> }
                <li>
                  <Link to="/"> about us </Link>
                </li>
                <li>
                  <Link to="/">faq</Link>
                </li>
                <li>
                  <Link to="/"> contact </Link>
                </li>
                <li className="header-btn1">
                  {isAuthenticated ? (
                    <p className="login">{user_data.name}</p>
                  ) : (
                    <a
                      className="login"
                      href="javascript:void(0)"
                      data-bs-toggle="modal"
                      data-bs-target="#loginpopup"
                      // onClick={loginPageModalShow}
                    >
                      login
                    </a>
                  )}
                </li>
                <li className="header-btn1">
                  {isAuthenticated ? (
                    <button className="dropdown-item" onClick={Logout}>
                      Logout
                    </button>
                  ) : (
                    ""
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <LoginPage />
    </>
  );
}

export default Header;
