import React, { useEffect, useState, useRef } from "react";

import { useLocation,useParams,useNavigate } from 'react-router-dom';
import { Base64 } from 'js-base64';
import userService from "../services/user.service";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../redux/auth";

function EncryptLoginPage() {

 const param = useParams();
//  console.log(encrypcode,"encrypted data");
const navigate=useNavigate();
const dispatch = useDispatch();
useEffect(()=>{
console.log(param,"gfggggg")
  if(param.encrypcode == undefined){
       console.log("not found");
       navigate('/');
  }else{
    //console.log(param.encrypcode,"encrypted data")
   // const decodedString = Base64.decode(param.encrypcode); // Decoded string  
    //console.log(decodedString,"decoded string")
   //console.log(decodedString,"base64 decode status")
   try {
    const decodedString = Base64.decode(param.encrypcode);
    const myArray = decodedString.split("_");   
   // console.log(myArray,"dfgjdjf");
     checkencryptlogin(myArray);
  }
  catch(err) {
  console.log("sdfs");
    dispatch(authActions.Logout());
    navigate('/');
  }
    
  }

},[])
var checkencryptlogin = async(myArray)=>{
  const form = new FormData();
  form.append("user_id", myArray[0]);
  form.append("session_id", myArray[1]);

  var responce = await userService.encryptlogin(form);

 console.log(responce.data);
  if (!responce.data.status) {
    //toast.error(responce.data.error);
    console.log(responce.data.error,"error log")
    navigate('/');
  } else {
    console.log("login successfull");
    dispatch(authActions.Login(responce.data.data[0]));
    navigate('/');
  }

}
return(<>test page</>)
}

export default EncryptLoginPage;
