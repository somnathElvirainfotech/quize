import React, { useEffect, useRef, useState } from "react";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Image,
  NavLink,
  Button,
  Modal,
} from "react-bootstrap";


import { useNavigate } from "react-router-dom";

import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchama } from "../schema";

import TokenHelper from "./TokenHelper";

import userService from "../services/user.service";
import { toast } from "react-toastify";
import learnig from "../assets/images/learnig-mode.svg";
import exam from "../assets/images/exam-mode.svg";
import leftbanner from "../assets/images/login-left-img.png";
import { AuthContext } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../redux/auth";
import { questionActions } from "../redux/question";
import Loader from "./Loader";

function LoginPage(props) {
  // const { user, dispatch } = useContext(userContext);

  const [loader, setLoader] = useState(false);

  const modalCloseRef = useRef();
  const navigate=useNavigate();

  // const handleClose = () => dispatch({type:"showLoginModal",value:false});
  // const {isAuthenticated,user_id,user_data}=useSelector(state=>state.auth)
  const dispatch = useDispatch();

  const [Dropdowndata, setDropdowndata] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchama),
  });
  var submit = async (data) => {
    // console.log(data);

    setLoader(true);
    


    const form = new FormData();
    form.append("email", data.email);
    form.append("password", data.password);

    var responce = await userService.login(form);

    // console.log(responce.data);
    if (responce.data.error) {
      toast.error(responce.data.error);
    } else {
      // console.log("login successfull");
    //   toast.success("login successfull");

     

      // localStorage.setItem("userdata", JSON.stringify(responce.data.data[0]));
      // localStorage.setItem("userid", responce.data.data[0].id);
      // // console.log(responce.data.data[0].id, 'id')
      // // console.log(responce.data.data[0], 'user')

      // dispatch({ type: "id", value: responce.data.data[0].id });
      // dispatch({ type: "name", value: responce.data.data[0].name });
      // dispatch({ type: "email", value: responce.data.data[0].email });

      // dispatch(questionActions.questionReset());

      dispatch(authActions.Login(responce.data.data[0]));

      modalCloseRef.current.click();

      //   alert(data.report_id,'response')
    }
    // if(responce.data.msg)
    // {
    //   reset();
    //   // console.log("login successfull")
    //     toast.success("login successfull")
    //     localStorage.setItem("userid",responce.data[0].id);
    //     // navigate("/admin")

    // }else{
    //   toast.error(responce.data.error)
    // }
    reset();

    setLoader(false);

    navigate('/');
  };
  return (
    <>
    {loader && <Loader />}
      <section className="model-login-popup">
        <div
          className="modal fade"
          id="loginpopup"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={modalCloseRef}
              />
              <div className="modal-content-wrap">
               
                <div className="model-right">
                  <h4>Sign In</h4>
                  <form className="row g-4" onSubmit={handleSubmit(submit)}>
                    <div className="col-md-12">
                      <label htmlFor="">E-Mail Address</label>
                      <input type="email" {...register("email")} />
                      <p style={{ color: "red" }} className="form-field-error">
                        {errors.email?.message}
                      </p>
                    </div>
                    <div className="col-md-12 mt-1">
                      <label htmlFor="">Password</label>
                      <input type="password" {...register("password")} />
                      <p style={{ color: "red" }} className="form-field-error">
                        {errors.password?.message}
                      </p>
                    </div>
                    <div className="col-md-12 my-3">
                      <button className="sign-in " type="submit">
                        Sign in
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <Modal
        {...props}
        onHide={props.onHide}
        animation={false}
        backdrop="static"
        keyboard={false}
        size="xl"
        centered
        aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
      >
        <Modal.Header className="btn-close" aria-label="Close" closeButton />
        <Modal.Body>
        <div className="modal-content">
          <div className="model-content-wrap">
            <div className="model-left">
              <img src={leftbanner} alt="mdl-img" />
            </div>
            <div className="model-right">
              <h4>Sign In</h4>
              <form className="row g-4" onSubmit={handleSubmit(submit)}>
                <div className="col-md-12">
                  <label htmlFor="">E-Mail Address</label>
                  <input type="email" {...register("email")} />
                  <p style={{ color: "red" }} className="form-field-error">
                    {errors.email?.message}
                  </p>
                </div>
                <div className="col-md-12">
                  <label htmlFor="">Password</label>
                  <input type="password" {...register("password")} />
                  <p style={{ color: "red" }} className="form-field-error">
                    {errors.password?.message}
                  </p>
                </div>
                <div className="col-md-12 my-5">
                  <button className="sign-in " type="submit">
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
          </div>
        </Modal.Body>
      </Modal> */}
    </>
  );
}

export default LoginPage;
