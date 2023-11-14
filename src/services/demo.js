// import axios from 'axios';
const axios = require('axios');
// myHeaders.append("Cookie", "PHPSESSID=oo7rt0iujv4h0ui5lrn30ic4e1");
class UserService {

  async login(data) {
    var myHeaders = new Headers();
// var session_url = 'https://www.cmfas.com.sg/practice/api.php?params=checklogin';

myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Basic c3RhZ2luZzo5QipxbDZmMDM=");
    console.log(data)
    var raw = JSON.stringify({
        "email": "asif.elvirainfotech@gmail.com",
        "password": "9B*ql6f03"
      });
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        mode: 'no-cors',
        body: raw,
        redirect: 'follow'
      };
      fetch("https://www.cmfas.com.sg/practice/api.php?params=checklogin", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    // var credentials = btoa(data);
        // var basicAuth = 'Basic ' + credentials;
    // return axio(session_url,requestOptions, {
        // auth: {
        //     username: 'staging',
        //     password: '9B*ql6f03',
        //   },
    
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization":"Basic c3RhZ2luZzo5QipxbDZmMDM=",
    //     "Access-Control-Allow-Origin":"*"
    //   },
    // });
  }
 
}


// eslint-disable-next-line import/no-anonymous-default-export
export default new UserService();
