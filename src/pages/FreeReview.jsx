import React, { useEffect, useRef, useState } from "react";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Image,
  NavLink,
  Button,
} from "react-bootstrap";


import userService from "../services/user.service";
import { useLocation, useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import prev from "../assets/images/prev.svg";
import next from "../assets/images/next.svg";
import mobile_new_session from "../assets/images/icon556.png";
import add from "../assets/images/add.svg";
import search from "../assets/images/search.svg";
import translate from "../assets/images/translate.svg";
import query from "../assets/images/query.svg";
import mentor from "../assets/images/mentor.svg";
import { AuthContext } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { questionActions } from "../redux/question";
import { useForm } from "react-hook-form";
import { newQID, removeDuplicates, textcopy } from "../common";
import SpeedRef from "./Modal/SpeedRef";
import AskMentor from "./Modal/AskMentor";
import { bookmarkActions } from "../redux/bookmark";
import report_error from '../assets/images/reporterror.png';
import ReportError from "./Modal/ReportError";
import parse from 'html-react-parser';
import Reporticon from "../assets/images/report.png";
import logo from "../assets/images/logo.png";
import Calculatoricon from "../assets/images/calculator.png";
import ScientificCalculator from "./Modal/ScientificCalculator";
import Loader from "./Loader";
import Swal from 'sweetalert2';

function FreeReview() {
  const dispatch = useDispatch();
  const question = useSelector((state) => state.question);
  const auth = useSelector((state) => state.auth);
  const [answerstatus, setAnswerstatus] = useState(0);
  const [explanationdisplay, setExplanationdisplay] = useState(false);
  const [explanationfontSize, setExplanationfontSize] = useState(14);
  const [loader, setLoader] = useState(false);
  // console.log("questionid  ", question.questionid);
  // console.log("questionlist  ", question.questionlist);

  const formref = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const handleNext = async () => {
    var index = question.count;
    if (question.count < question.totalQuestion - 1) {
      setLoader(true);
      setExplanationdisplay(false);
      index = index + 1;

      dispatch(questionActions.count(index));

      // setCurrentIndex();
      // // console.log(currentIndex, 'currentIndex')
      //   await saveAnswerObj();
      await getquestiondata(`qid${index}`);

      setLoader(false);
    }
  };

  const handlePrevious = async () => {
    // // console.log(currentIndex, 'currentIndex')
    var index = question.count;
    if (question.count > 0) {
      setLoader(true);
      index = index - 1;

      dispatch(questionActions.count(index));

      // setCurrentIndex(user.questionid.length - 1);

      //   await saveAnswerObj();

      await getquestiondata(`qid${index}`);

      setLoader(false);
    }
  };

  const handleFirst = async () => {
    dispatch(questionActions.count(0));

    // await saveAnswerObj();
    await getquestiondata(`qid0`);
  };

  const handleLast = async () => {
    var index = question.totalQuestion - 1;
    dispatch(questionActions.count(index));
    // await saveAnswerObj();
    await getquestiondata(`qid${question.totalQuestion - 1}`);
  };

  var getquestiondata = async (q_id) => {
    // let q_id = currentId.value
    // console.log(q_id, "  q_id");
    // console.log(question.questionid[q_id], "  q_value");

    // ==== answer form reset ========

    if (q_id !== "") {
      let datas = {
        next_qid: question.questionid[q_id],
        next_qid2: question.encryptquestionid[q_id],
        token:"guest"
      };

      var response = await userService.Nextquestion(datas);

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        // // console.log(response.data)

        // setDropdowndata(response.data)
        // // console.log(response.data, 'responsedata123')
        // setQuestiondata(response.data)

        let new_ans = await removeDuplicates(response.data.ques.ans);
        response.data.ques.ans = new_ans;

        // // console.log("faqdata ", response.data)

        dispatch(questionActions.questionlist(response.data.ques));
        dispatch(
          questionActions.speedRefFileLink(
            response.data.speed_reference_file_path
          )
        );

        if (response.data.ques.ans.length > 1) {
          if (formref.current !== null) {
            formref.current.reset();
            var form = formref.current;
            // =============== check box ============= //
            form.querySelector("#t_test1").className = "";
            form.querySelector("#t_test2").className = "";
            form.querySelector("#t_test3").className = "";
            form.querySelector("#t_test4").className = "";
          }

          reset();

          setValue("ans_type", "checkbox");
        } else {
          if (formref.current !== null) {
            formref.current.reset();

            var form = formref.current;
            form.querySelector("#t_test1").className = "";
            form.querySelector("#t_test2").className = "";
            form.querySelector("#t_test3").className = "";
            form.querySelector("#t_test4").className = "";
          }
          reset();

          setValue("ans_type", "radio");
        }
      }
    } else {
      // console.log("not get q_id");
    }
  };

  var setPreviousAnsValue = async () => {
    // alert(1);
    var oldQA_obj = question.answerObj;
    // question.questionid[q_id]

    for (const [index, i] of oldQA_obj.entries()) {
      if (question.questionlist.id === i.qid) {
        // console.log("fffffff " + i.ans.length);
        //alert(i.ans);

        var form = formref.current;

        if (question.questionlist.ans.length > 1) {
          // =============== check box ============= //

          setExplanationdisplay(true);

          form.querySelector("#t_test1").className = "";
          form.querySelector("#t_test2").className = "";
          form.querySelector("#t_test3").className = "";
          form.querySelector("#t_test4").className = "";

          const myArray = i.ans.split("");
          var answer = i.ans;

          // console.log(`ans id == ${i.qid} === ${myArray}`);

          for (var j of myArray) {
            if (j === "A") {
              setValue("test1", j);
            } else if (j === "B") {
              setValue("test2", j);
            } else if (j === "C") {
              setValue("test3", j);
            } else if (j === "D") {
              setValue("test4", j);
            }
          }

          if (question.questionlist.ans === answer) {

            // toast.success("your answer right");
            setAnswerstatus(1);
            if (answer.includes("A")) {
              form.querySelector("#t_test1").className = "right_ans";


            }

            if (answer.includes("B")) {
              form.querySelector("#t_test2").className = "right_ans";
            }

            if (answer.includes("C")) {
              form.querySelector("#t_test3").className = "right_ans";
            }

            if (answer.includes("D")) {
              form.querySelector("#t_test4").className = "right_ans";
            }
          } else {
            setAnswerstatus(2);
            // toast.success("your answer is wrong");
            if (question.questionlist.ans.includes("A")) {
              if (answer.includes("A")) {
                form.querySelector("#t_test1").className = "right_ans";
              } else {
                form.querySelector("#t_test1").className = "user_not_select_right_ans";
              }
            } else if (answer.includes("A")) {
              form.querySelector("#t_test1").className = "wrong_ans";
            }

            if (question.questionlist.ans.includes("B")) {
              if (answer.includes("B")) {
                form.querySelector("#t_test2").className = "right_ans";
              } else {
                form.querySelector("#t_test2").className = "user_not_select_right_ans";
              }
            } else if (answer.includes("B")) {
              form.querySelector("#t_test2").className = "wrong_ans";
            }

            if (question.questionlist.ans.includes("C")) {
              if (answer.includes("C")) {
                form.querySelector("#t_test3").className = "right_ans";
              } else {
                form.querySelector("#t_test3").className = "user_not_select_right_ans";
              }
            } else if (answer.includes("C")) {
              form.querySelector("#t_test3").className = "wrong_ans";
            }

            if (question.questionlist.ans.includes("D")) {
              if (answer.includes("D")) {
                form.querySelector("#t_test4").className = "right_ans";
              } else {
                form.querySelector("#t_test4").className = "user_not_select_right_ans";
              }
            } else if (answer.includes("D")) {
              form.querySelector("#t_test4").className = "wrong_ans";
            }


          }
        } else {
          //  ============== radio ============= ///

          setExplanationdisplay(true);

          form.querySelector("#t_test1").className = "";
          form.querySelector("#t_test2").className = "";
          form.querySelector("#t_test3").className = "";
          form.querySelector("#t_test4").className = "";

          setValue("answer", i.ans);

          // alert(question.questionlist.ans.includes('A'))
          console.log(i, "llllllll")
          var answer = i.ans;

          // var newForm = formref.current;

          // alert(answer)

          // // console.log("newForm ",newForm)
          if (question.questionlist.ans === answer) {
            // toast.success("your answer right");
            setAnswerstatus(1);
            if (answer.includes("A")) {
              form.querySelector("#t_test1").className = "right_ans";
            } else if (answer.includes("B")) {
              form.querySelector("#t_test2").className = "right_ans";
            } else if (answer.includes("C")) {
              form.querySelector("#t_test3").className = "right_ans";
            } else if (answer.includes("D")) {
              form.querySelector("#t_test4").className = "right_ans";
            }
          } else {
            setAnswerstatus(2);
            // toast.error("Your answer wrong");

            // var form = formref.current;

            // alert(11)

            if (answer.includes("A")) {
              form.querySelector("#t_test1").className = "wrong_ans";
            } else if (answer.includes("B")) {
              form.querySelector("#t_test2").className = "wrong_ans";
            } else if (answer.includes("C")) {
              form.querySelector("#t_test3").className = "wrong_ans";
            } else if (answer.includes("D")) {
              form.querySelector("#t_test4").className = "wrong_ans";
            }

            if (question.questionlist.ans.includes("A")) {
              form.querySelector("#t_test1").className = "right_ans";
            } else if (question.questionlist.ans.includes("B")) {
              form.querySelector("#t_test2").className = "right_ans";
            } else if (question.questionlist.ans.includes("C")) {
              form.querySelector("#t_test3").className = "right_ans";
            } else if (question.questionlist.ans.includes("D")) {
              form.querySelector("#t_test4").className = "right_ans";
            }
          }
        }
        break;
      } else {
        setExplanationdisplay(false);
        setAnswerstatus(0);
      }
    }
  };

  const finalAnsSubmit = async () => {
    // alert(question.answerObj.length)
    if (
      Number(question.count) === Number(question.totalQuestion - 1) &&
      Number(question.answerObj.length) === Number(question.totalQuestion)
    ) {
      // toast.success("answer submit successfull");

      dispatch(questionActions.count(0));
      navigate("/result");
    }
  };

  const addBookmark = async () => {
    const form = new FormData();
    form.append("user_id", auth.user_id);
    form.append("question_id", question.questionlist.id);
    form.append("subject_name", question.subject_name);
    form.append("token", auth.encrypt_user_id);
    var responce = await userService.AddBookmark(form);

    // console.log("AddBookmark ", responce.data)

    if (responce.data.status) {
      toast.success(responce.data.msg);
    } else {
      toast.warning(responce.data.error);
    }

    dispatch(bookmarkActions.questionReset());
  }

  const newSession = async () => {

    // Swal.fire({
    //   title: 'Do you want to start new session?',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes',
    //   cancelButtonText: "No"
    // }).then(async (result) => {

    //   if (result.isConfirmed) {
    //     navigate("/")
    //   }
    // })

    navigate("/")

  }


  useEffect(() => {
    // // console.log(user.questionlist.ans.length, '  user.questionlist.ans.length ')

    // if (question.count === 0) {
    //   getquestiondata(`qid0`);
    // }

    if (question.answerObj.length > 0) {
      setPreviousAnsValue();
    }
    document.body.classList.remove('bg-salmon');
  }, [question.questionlist]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.clear();
    }
  }, []);

  return (
    <>
      {loader && <Loader />}
      <section className="Money-Received">
        <div className="container">
          {/* ===== question and exam list ====== */}

          <div className="Money-Received-box money-Received-review-box">
            <div className="money-header review">

              <div className="logo">
                <a href="/practice">
                  <img src={logo} alt="logo" className="footer-logo" />
                </a>
              </div>
              <div className="money-h-middle">

                <span className="page-count">Attempted : {question.answerObj.length}/{question.totalQuestion}</span>
                <ul className="pagination-wrap exam-pagination">
                  <li>
                    <a href="#" onClick={handlePrevious}>
                      <img src={prev} alt="prev" />
                      Previous Question
                    </a>
                  </li>
                  <li className="countnum">
                    <span>{question.count + 1}</span>/<span>{question.totalQuestion}</span>
                  </li>

                  <li>
                    {(question.count === question.totalQuestion - 1) ? (<>
                      <a href="#" onClick={newSession}>
                        Do New Session
                        <img src={mobile_new_session} alt="next" className="mobile_new_session" />
                      </a>
                    </>) : (
                      <a href="#" onClick={handleNext}>
                        Next Question
                        <img src={next} alt="next" />
                      </a>)}
                  </li>

                </ul>

              </div>
              <div className="money-h-right">


                {answerstatus === 1 &&
                  <span style={{ color: "#090", fontSize: "16px" }}>
                    Correct answer
                  </span>
                }
                {answerstatus === 2 &&
                  <span style={{ color: "#ff0000", fontSize: "16px" }}>
                    Wrong answer
                  </span>
                }
                {answerstatus === 0 &&
                  <span style={{ fontSize: "16px" }}>
                    Not attempted
                  </span>
                }
                {/* <div className="pagination-res">
                  <span className="tr-fl">
                    <i className="fa-solid fa-circle-check" />
                  </span>
                  <span>true</span>
                  <span className="count">1</span>
                </div> */}
              </div>
            </div>
            <div className="money-re-content money_cust_review">
              <div className="content-left">
                <div className="ch-h">
                  <h3>{question.subject_name}</h3>
                  <small>QID: {newQID(auth.user_id, question.questionlist.id)}</small>
                </div>
                <p onCopy={e => textcopy(auth.user_id, auth.user_data.email,auth.encrypt_user_id)}>
                  {parse(question.questionlist.question)}

                </p>

                <div id="monybgwater">
                  <p id="bg-text">{newQID(auth.user_id, question.questionlist.id)}</p>
                </div>

              </div>
              <div className="content-right">
                {question.questionlist.ans.length > 1 ? (
                  <div className="ch-h">
                    <h3>Select all options that apply</h3>
                  </div>
                ) : (
                  <div className="ch-h">
                    <h3>Select the best option</h3>
                  </div>
                )}


                {/* ======== FORM 2 ANS length check =========  */}

                <form ref={formref} className="qiz">
                  {question.questionlist.ans.length > 1 && (
                    <>
                      <input
                        type="hidden"
                        {...register("ans_type")}
                        value={"checkbox"}
                      />
                      <p id="t_test1">
                        <input
                          type="checkbox"
                          id="test1"
                          {...register("test1")}
                          value={"A"}
                          disabled={true}
                        />
                        <label htmlFor="test1" onCopy={e => textcopy(auth.user_id, auth.user_data.email,auth.encrypt_user_id)}>
                          {question.questionlist.choice1}
                        </label>
                      </p>
                      <p id="t_test2">
                        <input
                          type="checkbox"
                          id="test2"
                          {...register("test2")}
                          value={"B"}
                          disabled={true}
                        />
                        <label htmlFor="test2" onCopy={e => textcopy(auth.user_id, auth.user_data.email,auth.encrypt_user_id)}>
                          {question.questionlist.choice2}
                        </label>
                      </p>
                      <p id="t_test3">
                        <input
                          type="checkbox"
                          id="test3"
                          {...register("test3")}
                          value={"C"}
                          disabled={true}
                        />
                        <label htmlFor="test3" onCopy={e => textcopy(auth.user_id, auth.user_data.email,auth.encrypt_user_id,auth.encrypt_user_id)}>
                          {question.questionlist.choice3}
                        </label>
                      </p>
                      <p id="t_test4">
                        <input
                          type="checkbox"
                          id="test4"
                          {...register("test4")}
                          value={"D"}
                          disabled={true}
                        />
                        <label htmlFor="test4" onCopy={e => textcopy(auth.user_id, auth.user_data.email)}>
                          {question.questionlist.choice4}
                        </label>
                      </p>
                    </>
                  )}

                  {question.questionlist.ans.length === 1 && (
                    <>
                      <input
                        type="hidden"
                        {...register("ans_type")}
                        value={"radio"}
                      />
                      <p id="t_test1">
                        <input
                          type="radio"
                          id="answer1"
                          {...register("answer")}
                          value={"A"}
                          disabled={true}
                        />
                        <label htmlFor="answer1" onCopy={e => textcopy(auth.user_id, auth.user_data.email,auth.encrypt_user_id)} >
                          {question.questionlist.choice1}
                        </label>
                      </p>
                      <p id="t_test2">
                        <input
                          type="radio"
                          id="answer2"
                          {...register("answer")}
                          value={"B"}
                          disabled={true}
                        />
                        <label htmlFor="answer2" onCopy={e => textcopy(auth.user_id, auth.user_data.email,auth.encrypt_user_id)}>
                          {question.questionlist.choice2}
                        </label>
                      </p>
                      <p id="t_test3">
                        <input
                          type="radio"
                          id="answer3"
                          {...register("answer")}
                          value={"C"}
                          disabled={true}
                        />
                        <label htmlFor="answer3" onCopy={e => textcopy(auth.user_id, auth.user_data.email,auth.encrypt_user_id)}>
                          {question.questionlist.choice3}
                        </label>
                      </p>
                      <p id="t_test4">
                        <input
                          type="radio"
                          id="answer4"
                          {...register("answer")}
                          value={"D"}
                          disabled={true}
                        />
                        <label htmlFor="answer4" onCopy={e => textcopy(auth.user_id, auth.user_data.email)}>
                          {question.questionlist.choice4}
                        </label>
                      </p>
                    </>
                  )}
                </form>

                {explanationdisplay && (
                  <>
                    <p
                      className="ex-custom-bor"
                      style={{ fontSize: explanationfontSize, lineHeight: 1.5 }}
                    >
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        Explanation :
                      </span>
                      <span
                        style={{ marginLeft: "5px", color: "green" }}
                        onCopy={(e) =>
                          textcopy(auth.user_id, auth.user_data.email,auth.encrypt_user_id)
                        }
                      >
                        {parse(question.questionlist.explanation)}
                      </span>
                    </p>
                  </>
                )}

                {/* ======== END FORM 2 ANS length check =========  */}

                <div className="multiple-options">
                  <ul>
                    {/* <li>
                      <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#scientificCalculatorPopup"
                        title="Scientific Calculator"
                      >
                        <img src={Calculatoricon} alt="query" />
                      </a>
                    </li> */}
                    {/* <li>
                      <a href="#" title="Add Bookmark" onClick={addBookmark} >
                        <img src={add} alt="add" />
                      </a>
                    </li> */}
                    <li>
                      <a
                        href="#"
                        title="Speed Reference"
                        onClick={() =>
                          Swal.fire({
                            title: "Notice",
                            html: '<br/><br/>SpeedRef™ is an on-screen integration with the official study guide for quick referencing.<br/><br/><br/>Upgrade to Silver Plan or higher through the Dashboard page in order to use this feature.',
                            icon: "notice",
                            confirmButtonText: "Ok",
                          })
                        }
                      >
                        <img src={search} alt="search" />
                      </a>
                    </li>
                    <li>
                      <a href="#" 
                      title="Translation"
                      onClick={() =>
                          Swal.fire({
                            title: "Notice",
                            html: '<br/><br/>Questions, choices and explanations can now be shown in your native language.<br/><br/><br/>Upgrade to Silver Plan or higher through the Dashboard page to use this feature.',
                            icon: "notice",
                            confirmButtonText: "Ok",
                          })}
                      >
                        <img src={translate} alt="translate" />
                      </a>
                    </li>
                    {question.flag_type === "ask_mentor" ? (
                      <li>
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#mentorpopup"
                          title="Ask a Mentor"
                        // onClick={aksMentorRefhandleShow}
                        >
                          <img src={query} alt="query" />
                        </a>
                      </li>

                    ) : (
                      <li>
                        <a
                          href="#"
                          data-bs-toggle="modal"
                          data-bs-target="#Rerrorpopup"
                          title="Report an Erroneous Question"
                        // onClick={aksMentorRefhandleShow}
                        >
                          <img src={Reporticon} alt="report_error" />
                        </a>
                      </li>

                    )}
                  </ul>
                </div>
                <div id="monybgwater">
                  <p id="bg-text">{newQID(auth.user_id, question.questionlist.id)}</p>
                </div>
              </div>
            </div>

          </div>

          <div class="mfooter">
            <div className="multiple-options">
              <ul>
                {/* <li>
                  <a
                    href="#"
                    data-bs-toggle="modal"
                    data-bs-target="#scientificCalculatorPopup"
                    title="Scientific Calculator"
                  >
                    <img src={Calculatoricon} alt="query" />
                  </a>
                </li> */}
                {/* <li>
                  <a href="#" title="Add Bookmark" onClick={addBookmark}>
                    <img src={add} alt="add" />
                  </a>
                </li> */}
               <li>
                      <a
                        href="#"
                        title="Speed Reference"
                        onClick={() =>
                          Swal.fire({
                            title: "Notice",
                            html: '<br/><br/>SpeedRef™ is an on-screen integration with the official study guide for quick referencing.<br/><br/><br/>Upgrade to Silver Plan or higher through the Dashboard page in order to use this feature.',
                            icon: "notice",
                            confirmButtonText: "Ok",
                          })
                        }
                      >
                        <img src={search} alt="search" />
                      </a>
                </li>
                <li>
                      <a href="#" 
                      title="Translation"
                      onClick={() =>
                          Swal.fire({
                            title: "Notice",
                            html: '<br/><br/>Questions, choices and explanations can now be shown in your native language.<br/><br/><br/>Upgrade to Silver Plan or higher through the Dashboard page to use this feature.',
                            icon: "notice",
                            confirmButtonText: "Ok",
                          })}
                      >
                        <img src={translate} alt="translate" />
                      </a>
                    </li>
                {question.flag_type === "ask_mentor" ? (
                  <li>
                    <a
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#mentorpopup"
                      title="Ask a Mentor"
                    // onClick={aksMentorRefhandleShow}
                    >
                      <img src={query} alt="query" />
                    </a>
                  </li>
                ) : (
                  <li>
                    <a
                      href="#"
                      data-bs-toggle="modal"
                      data-bs-target="#Rerrorpopup"
                      title="Report an Erroneous Question"
                    // onClick={aksMentorRefhandleShow}
                    >
                      <img src={Reporticon} alt="report_error" />
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>


          {/* <div className="btn-wrap exam-btn">
            {question.count > 0 && (
              <>
                <button className="animate-btn" onClick={handleFirst}>
                  First
                </button>
              </>
            )}

            {question.count > 0 && (
              <>
                <button className="animate-btn" onClick={handlePrevious}>
                  Prev
                </button>
              </>
            )}

            {question.count <= question.totalQuestion - 2 && (
              <>
                <button className="animate-btn" onClick={handleNext}>
                  Next
                </button>
              </>
            )}

            {question.count <= question.totalQuestion - 2 && (
              <>
                <button onClick={handleLast} className="animate-btn">
                  Last
                </button>
              </>
            )}

            {question.count === question.totalQuestion - 1 && (
              <button className="animate-btn" onClick={finalAnsSubmit}>
                End
              </button>
            )}
          </div> */}

        </div>
      </section>

      {/* ======== custom modal ======== */}
      <SpeedRef />

      <AskMentor />

      <ReportError />

      <ScientificCalculator />

    </>

  );
}

export default FreeReview;
