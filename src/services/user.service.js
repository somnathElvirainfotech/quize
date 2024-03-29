import axios from 'axios';
// const axios = require('axios');

//https://www.cmfas.com.sg/practice/api2.php

class UserService {

  async login(data) {
    return axios.post('https://www.cmfas.com.sg/practice/api2.php?params=checklogin', data, {
      headers: {
        "Content-Type": "application/json"
      },
    });


  }
  async encryptlogin(data) {
    return axios.post('https://www.cmfas.com.sg/practice/api2.php?params=checkencryptlogin', data, {
      headers: {
        "Content-Type": "application/json"
      },
    });


  }
  async getlist(datas){
    return axios.post('https://www.cmfas.com.sg/practice/api2.php?params=TestEngineFilterList',datas,{
      headers: {
        "Content-Type": "application/json"
      },
    });
  }
  async get_free_trial_dropdown_data(){
    return axios.get('https://www.cmfas.com.sg/practice/api2.php?params=free_trial_dropdown_data');
  }
  // async get_new_dropdown_data(){
  //   return axios.get('https://www.cmfas.com.sg/practice/api2.php?params=module_dropdown_data');
  // }
  
  async get_new_dropdown_data(datas){
    //alert("test")
    return axios.post('https://www.cmfas.com.sg/practice/api2.php?params=module_dropdown_data',datas,{
      headers: {
        "Content-Type": "application/json"
      },
    });
  }
  // async getchapterbymodule(){
  //   return axios.get('https://www.cmfas.com.sg/practice/api2.php?params=chapter_dropdown_data_module');
  // }
  async getchapterbymodule(datas){
    return axios.post('https://www.cmfas.com.sg/practice/api2.php?params=chapter_dropdown_data_module',datas,{
      headers: {
        "Content-Type": "application/json"
      },
    });
  }
  // async getmobiledatalist(){
  //   return axios.get('https://www.cmfas.com.sg/practice/api2.php?params=mobile_dropdown_data');
  // }
  async getmobiledatalist(datas){
    return axios.post('https://www.cmfas.com.sg/practice/api2.php?params=mobile_dropdown_data',datas,{
      headers: {
        "Content-Type": "application/json"
      },
    });
  }
  async Postquestion(data) {
    return axios.post('https://www.cmfas.com.sg/practice/api2.php?params=question', data, {
      headers: {
        "Content-Type": "application/json"
      },
    });


  }

  async FreeQuestion(data) {
    return axios.post('https://www.cmfas.com.sg/practice/api2.php?params=free_question', data, {
      headers: {
        "Content-Type": "application/json"
      },
    });


  }

  async Nextquestion(datas) {
    return axios.post('https://www.cmfas.com.sg/practice/api2.php?params=next_question', datas, {
      headers: {
        "Content-Type": "application/json"
      },
    });


  }


  async AnswerSubmit(data) {
    return axios.post('https://www.cmfas.com.sg/practice/api2.php?params=answer_submit', data, {
      headers: {
        "Content-Type": "application/json"
      },
    });


  }


  async AsksMentor(data) {
    return axios.post('https://www.cmfas.com.sg/practice/api2.php?params=ask_mentor', data, {
      headers: {
        "Content-Type": "application/json"
      },
    });


  }

  async ReportQuestion(data) {
    return axios.post('https://www.cmfas.com.sg/practice/api2.php?params=report_question', data, {
      headers: {
        "Content-Type": "application/json"
      },
    });


  }


  async AddBookmark(data) {
    return axios.post('https://www.cmfas.com.sg/practice/api2.php?params=add_bookmark', data, {
      headers: {
        "Content-Type": "application/json"
      },
    });


  }

  async RemoveBookmark(data) {
    return axios.post('https://www.cmfas.com.sg/practice/api2.php?params=remove_bookmark', data, {
      headers: {
        "Content-Type": "application/json"
      },
    });


  }

  async BookmarkList(data) {
    return axios.post('https://www.cmfas.com.sg/practice/api2.php?params=bookmark_list', data, {
      headers: {
        "Content-Type": "application/json"
      },
    });


  }
  async addcopytext(data) {
    return axios.post('https://www.cmfas.com.sg/practice/api2.php?params=copy_track', data, {
      headers: {
        "Content-Type": "application/json"
      },
    });


  }
  

}


export default new UserService();
