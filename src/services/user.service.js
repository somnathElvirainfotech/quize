import axios from 'axios';
// const axios = require('axios');

class UserService {

  async login(data) {
    return axios.post('https://www.cmfasacademy.com/api.php?params=checklogin', data, {
      headers: {
        "Content-Type": "application/json"
      },
    });


  }
  async getlist(datas){
    return axios.post('https://www.cmfasacademy.com/api.php?params=TestEngineFilterList',datas,{
      headers: {
        "Content-Type": "application/json"
      },
    });
  }
  async Postquestion(data) {
    return axios.post('https://www.cmfasacademy.com/api.php?params=question', data, {
      headers: {
        "Content-Type": "application/json"
      },
    });


  }

  async Nextquestion(datas) {
    return axios.post('https://www.cmfasacademy.com/api.php?params=next_question', datas, {
      headers: {
        "Content-Type": "application/json"
      },
    });


  }


  async AnswerSubmit(data) {
    return axios.post('https://www.cmfasacademy.com/api.php?params=answer_submit', data, {
      headers: {
        "Content-Type": "application/json"
      },
    });


  }


  async AsksMentor(data) {
    return axios.post('https://www.cmfasacademy.com/api.php?params=ask_mentor', data, {
      headers: {
        "Content-Type": "application/json"
      },
    });


  }
  

}


// eslint-disable-next-line import/no-anonymous-default-export
export default new UserService();
