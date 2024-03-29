import React, { useEffect, useState, useRef } from "react";

import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Base64 } from 'js-base64';
import userService from "../services/user.service";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../redux/auth";
import moment from 'moment';
import CryptoJS from 'crypto-js';


function EncryptLoginPage() {

  const param = useParams();
  //  console.log(encrypcode,"encrypted data");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function decryptString(encryptedString) {
    const key = CryptoJS.enc.Hex.parse('dabb05eeb2b45ebe2d291c2d130d0da2');
    const iv = CryptoJS.enc.Hex.parse('b8aa5adf307351dc');
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(encryptedString),
    });
  
    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, { iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  
  





  useEffect(() => {
    // console.log(param,"gfggggg")
    if (param.encrypcode == undefined) {
      //  console.log("not found");
      navigate('/');
    } else {
      //console.log(param.encrypcode,"encrypted data")
      // const decodedString = Base64.decode(param.encrypcode); // Decoded string  
      //console.log(decodedString,"decoded string")
      //console.log(decodedString,"base64 decode status")
      try {
        //   const decodedString = Base64.decode(param.encrypcode);
        //   const myArray = decodedString.split("_");   
        //  console.log(myArray,"dfgjdjf");
        //    checkencryptlogin(myArray);
      
        checkencryptlogin(param.encrypcode);
      }
      catch (err) {
        // console.log("sdfs");
        dispatch(authActions.Logout());
        navigate('/');
      }

    }

  }, [])

  var checkencryptlogin = async (encrypcode) => {
    var final_data= decryptString(param.encrypcode);
   // alert(final_data);

    const myArray = final_data.split("_");
console.log(myArray,"fldgdjfl");
    if(myArray[0] !="" && myArray[1] !="" && myArray[2] !=""){

         // ===========================================
    // var encrypt_time = myArray[0];
    // // console.log(encrypt_time,"agldifjo")
    // var jtime = new Date(encrypt_time * 1000);
    // var startTime = moment(jtime, 'hh:mm:ss');

    // var endTime = moment(new Date(), 'hh:mm:ss');

    // var hoursDiff = endTime.diff(startTime, 'seconds');

    //   const form = new FormData();
   
    //   form.append("token",param.encrypcode);
      
    //   form.append("session_id", myArray[2]);
      var data={
        "token":param.encrypcode,
        "session_id":myArray[2]
      }     
      
      var responce = await userService.encryptlogin(JSON.stringify(data));

      console.log(responce.data,"encryption response");
      if (!responce.data.status) {
        //toast.error(responce.data.error);
        alert(responce.data.error);
        // console.log(responce.data.error,"error log")
        dispatch(authActions.Logout());
        navigate('/');
      } else {
        // console.log("login successfull");
        dispatch(authActions.Save_encrypt_value(param.encrypcode));
        dispatch(authActions.Login(responce.data.data[0]));
        navigate('/');
      }
    // }catch(err) {
    //   console.log(err.message)
    // }
    

    }else{
      alert('Invalid or expired login session. Please re-login.')
      dispatch(authActions.Logout());
      navigate('/');
    }
   

  }

  
  return (<></>)
}

export default EncryptLoginPage;
