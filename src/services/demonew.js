import axios from 'axios';
// const axios = require('axios');

class UserService {

  async login(data) {

    var session_url = 'https://www.cmfas.com.sg/practice/api.php?params=checklogin';


        // console.log(data)
        // var raw = JSON.stringify({
        //     "email": "asif.elvirainfotech@gmail.com",
        //     "password": "9B*ql6f03"
        //   });


          var requestOptions = {

            mode: 'no-cors',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: data,
            redirect: 'follow'
          };
          // console.log(basicAuth,'basicAuth')
          fetch("https://www.cmfas.com.sg/practice/api.php?params=checklogin",requestOptions)
          .then(response => {
            console.log(response,'response')
            
          })
          .then(result => {
            console.log(result,'result')
                  // const jsonResult = JSON.parse(result);
                  // console.log(jsonResult);
          })
          .catch(error => console.log('Fetch error:', error));




  }

}


// eslint-disable-next-line import/no-anonymous-default-export
export default new UserService();
