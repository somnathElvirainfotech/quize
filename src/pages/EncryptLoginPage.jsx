import React, { useEffect, useState, useRef } from "react";

import { useLocation,useParams } from 'react-router-dom';
function EncryptLoginPage() {

 const param = useParams();
//  console.log(encrypcode,"encrypted data");

useEffect(()=>{
console.log(param,"gfggggg")
  if(param.encrypcode == undefined){
console.log("not found")
  }else{
    console.log(param.encrypcode,"encrypted data")
  }

},[])

return(<>test page</>)
}

export default EncryptLoginPage;
