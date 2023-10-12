import React, { useEffect, useState, useRef } from "react";

import { useLocation,useParams } from 'react-router-dom';
import { Base64 } from 'js-base64';
function EncryptLoginPage() {

 const param = useParams();
//  console.log(encrypcode,"encrypted data");

useEffect(()=>{
console.log(param,"gfggggg")
  if(param.encrypcode == undefined){
       console.log("not found")
  }else{
    //console.log(param.encrypcode,"encrypted data")
    const decodedString = Base64.decode(param.encrypcode); // Decoded string  
    console.log(decodedString,"decoded string")
  }

},[])

return(<>test page</>)
}

export default EncryptLoginPage;
