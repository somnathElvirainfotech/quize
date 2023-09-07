import React, { useEffect, useRef, useState } from "react";
import { Navbar, Container, Nav, NavDropdown, Image, NavLink, Button } from 'react-bootstrap';

import { useContext } from 'react';
import { userContext } from '../store';
import userService from '../services/user.service';
import { useLocation, useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import prev from '../assets/images/prev.svg';
import next from '../assets/images/next.svg';
import add from '../assets/images/add.svg';
import search from '../assets/images/search.svg';
import translate from '../assets/images/translate.svg';
import query from '../assets/images/query.svg';
import mentor from '../assets/images/mentor.svg';
import { AuthContext } from '../App';
import { useDispatch, useSelector } from "react-redux";
import { questionActions } from "../redux/question";
import { useForm } from "react-hook-form";
import { removeDuplicates } from "../common";

function Result() {
  const dispatch = useDispatch();
  const question = useSelector(state => state.question);

 
  console.log("questionlist  ", question.questionlist);

 const navigate=useNavigate();

 
  
 var getquestiondata = async (q_id) => {
    // let q_id = currentId.value
    console.log(q_id, "  q_id");
    console.log(question.questionid[q_id], "  q_value");

    // ==== answer form reset ========




    if (q_id !== "") {
      let datas = {
        "next_qid": question.questionid[q_id]
      }



      var response = await userService.Nextquestion(datas);



      if (response.data.error) {

        toast.error(response.data.error)

      } else {

        // console.log(response.data)

        // setDropdowndata(response.data)
        // console.log(response.data, 'responsedata123')
        // setQuestiondata(response.data)

        let new_ans = await removeDuplicates(response.data.ques.ans)
        response.data.ques.ans = new_ans;

        // console.log("faqdata ", response.data)


        dispatch(questionActions.questionlist(response.data.ques));

        if (response.data.ques.ans.length > 1) {
        //   if (formref.current !== null)
        //     formref.current.reset();
        //   reset();
        //   setValue("ans_type", "checkbox")

        } else {
        //   if (formref.current !== null)
        //     formref.current.reset();
        //   reset();
        //   setValue("ans_type", "radio")

        }

      }


    }
    else {
      console.log("not get q_id")
    }
  }


  useEffect(()=>{
    getquestiondata(`qid0`);
  },[])


  


  return (
    <>
      <section className="Money-Received">
        <div className="container">
        
        


         {/* ======== result ========== */}
          
            <div className="Money-Received-box">
            <div className="money-header result-header">
              <h1>Result</h1>
            </div>

            <div className="result-content">
              <div className="content-middle">
                  <h4>You've answered</h4>
                  <h4>{question.totalCurrectAns} out of {question.totalQuestion} Qs correctly.</h4>
                  <h4>Passing Score : 75 %</h4>
                  <h4>Your Score : {((question.totalCurrectAns/question.totalQuestion)*100)} %</h4>
                  
                  <h4>{((question.totalCurrectAns/question.totalQuestion)*100) >= 75 ? "PASSED":"FAILED"}</h4>
                  
                  <div class="btn-wrap">
                    <button className="animate-btn" onClick={()=>navigate('/review')} >Review</button>
                    <button className="animate-btn" onClick={()=>navigate("/")}>New Test</button>
                  </div>
                  
              </div>
              
            </div>
          </div>
        


      

        </div>
      </section>

      <section className="model-Search-Popup">
        <div
          className="modal fade"
          id="searchpopup"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
              <h2>START OF TRUNCATED PORTION OF STUDY GUIDE</h2>
              <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
                sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
                rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
                ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
                sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
                dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
                et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                takimata sanctus est Lorem ipsum dolor sit amet.
              </p>
              <div className="pera-gap" />
              <h2>Lorem Ipsum Dolor Sit Amet, Consetetur</h2>
              <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
                sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
                rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
                ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
                sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
                dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
                et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                takimata sanctus est Lorem ipsum dolor sit amet.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="mentor-Popup">
        <div
          className="modal fade"
          id="mentorpopup"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
              <h2>
                {" "}
                <img src={mentor} alt="mentor" /> Ask A Mentor
              </h2>
              <p>Please Read And Agree To The Following:</p>
              <div className="check-wrap">
                <ul>
                  <li>
                    <input type="checkbox" />
                    <label htmlFor="">
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                      diam.
                    </label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label htmlFor="">
                      Nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
                      erat.
                    </label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label htmlFor="">
                      At vero eos et accusam et justo duo dolores et ea rebum.
                    </label>
                  </li>
                  <li>
                    <input type="checkbox" />
                    <label htmlFor="">
                      Stet clita kasd gubergren, no sea takimata sanctus est Lorem
                      ipsum.
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>



    </>
  )
}

export default Result