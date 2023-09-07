import { Navigate } from "react-router-dom";

class TokenHelper {
  state = {
    language_type: "",
  };

  constructor() {
    // this._accessToken = "oko";
  }

  getHeader() {
    return {
      headers: {
        // "Content-Type": "application/json",
        "id": this.getId()
      },
    };
  }

  setId(payload){
    localStorage.setItem("iddata",payload)
  }

  getId(){
    return localStorage.getItem("iddata")
  }

  


  setUserInfo(payload){
    localStorage.setItem("user_info",JSON.stringify(payload))
  }

  getUserInfo(){
    var data=JSON.parse(localStorage.getItem("user_info"));
    return data;
  }
  setLogoutInfo(){
    localStorage.clear();
  }

   
}

export default new TokenHelper();
