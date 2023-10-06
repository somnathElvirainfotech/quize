import React, { useEffect, useState, useRef } from "react";
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
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/images/logo.png";
import { AuthContext } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../redux/auth";
import LoginPage from "./LoginPage";
import MobileSelect, { CustomConfig } from "mobile-select";
import Updownarrow from "../assets/images/up-down-arrow.png";

function MobileSelector(props) {
  const auth = useSelector((state) => state.auth);
  var navigate = useNavigate();
  const dispatch = useDispatch();
  const tirggerRef = useRef(null);
  let msInstance = null;

  useEffect(() => {
    if (!msInstance) {
      //alert("ok")
      //   msInstance?.destroy();
      msInstance = new MobileSelect({
        title: "Selector",
        cancelBtnText: "Cancel",
        ensureBtnText: "Select",
        wheels: [{ data: props.MobileDropdowndata }],
        trigger: tirggerRef.current,
        triggerDisplayValue: false, // If you don't want to overwrite the HTML inside the trigger, you need to set this to false
        onChange: (data) => {
          // alert("fg");
          console.log(data,"tttttttttt")
          if(data.length > 1){
            props.setSelectedCourseVal(data[0].value); 
            props.setSelectedVal(data[1].value); 
          props.setSelectedId(data[1].id); 

          }else{
            props.setSelectedVal(data[0].value); 
          props.setSelectedId(data[0].id); 

          }
          
          //console.log(data[0].id,"asdfasd");
          // props.setValue("lstSubject", data[0].id);
        },
      });
    }
    return () => {
      msInstance?.destroy(); // Destroying instance
    };
  }, [props.MobileDropdowndata]);

  return (
    <>
      <div className="mb-f-v1" ref={tirggerRef}>
        {props.selectedVal ? (
          <>
            
            <span className="mb-f-v2">{props.selectedCourseVal}</span>
            <span className="mb-f-v3">
              <i className="fa-solid fa-play"></i>
            </span>
            <span className="mb-f-v2">{props.selectedVal}</span>
            <span className="mb-f-v5">
              <img src={Updownarrow} alt="Logo" />
            </span>
          </>
        ) : (
          <>
            {" "}
            <span className="mb-f-v2">Pick</span>
            <span className="mb-f-v3">
              <i className="fa-solid fa-play"></i>
            </span>
            <span className="mb-f-v4">One</span>
            <span className="mb-f-v5">
              <img src={Updownarrow} alt="Logo" />
            </span>
          </>
        )}
      </div>
    </>
  );
}

export default MobileSelector;
