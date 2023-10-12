import React, { useEffect, useState, useRef } from "react";

import { useLocation,useParams } from 'react-router-dom';
function EncryptLoginPage() {

 const {encrypcode} = useParams();
 console.log(encrypcode,"encrypted data");

return(<>test page</>)
}

export default EncryptLoginPage;
