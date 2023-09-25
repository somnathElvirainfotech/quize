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
import report_error from "../assets/images/reporterror.png";
import ReportError from "./Modal/ReportError";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";
import ScientificCalculator from "./Modal/ScientificCalculator";
import Reporticon from "../assets/images/report.png";
import Calculatoricon from "../assets/images/calculator.png";
import Swal from "sweetalert2";

function FreeExam() {
  const dispatch = useDispatch();
  const question = useSelector((state) => state.question);
  const auth = useSelector((state) => state.auth);

  console.log("questionid  ", question.questionid);
  console.log("questionlist  ", question.questionlist);

  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(22);
  const [explanationdisplay, setExplanationdisplay] = useState(false);

  const FontInc = () => {
    if (fontSize < 20) {
      setFontSize((e) => e + 1);
      setLineHeight((e) => e + 4);
    }
  };

  const FontDnc = () => {
    if (fontSize > 12) {
      setFontSize((e) => e - 1);
      if (fontSize > 14) {
        setLineHeight((e) => e - 4);
      }
    }
  };

  const formref = useRef(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const handleNext = async () => {
    var index = question.count;
    if (question.count < question.totalQuestion - 1) {
      setExplanationdisplay(false);
      index = index + 1;

      dispatch(questionActions.count(index));

      // setCurrentIndex();
      // console.log(currentIndex, 'currentIndex')
      await saveAnswerObj();
      await getquestiondata(`qid${index}`);
    }
  };

  const handlePrevious = async () => {
    // console.log(currentIndex, 'currentIndex')
    var index = question.count;
    if (question.count > 0) {
      index = index - 1;

      dispatch(questionActions.count(index));

      // setCurrentIndex(user.questionid.length - 1);

      await saveAnswerObj();

      await getquestiondata(`qid${index}`);
    }
  };

  const handleFirst = async () => {
    dispatch(questionActions.count(0));

    await saveAnswerObj();
    await getquestiondata(`qid0`);
  };

  const handleLast = async () => {
    var index = question.totalQuestion - 1;
    dispatch(questionActions.count(index));
    await saveAnswerObj();
    await getquestiondata(`qid${question.totalQuestion - 1}`);
  };

  var getquestiondata = async (q_id) => {
    // let q_id = currentId.value
    console.log(q_id, "  q_id");
    console.log(question.questionid[q_id], "  q_value");

    // ==== answer form reset ========

    if (q_id !== "") {
      let datas = {
        next_qid: question.questionid[q_id],
      };

      var response = await userService.Nextquestion(datas);

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        // console.log(response.data)

        // setDropdowndata(response.data)
        // console.log(response.data, 'responsedata123')
        // setQuestiondata(response.data)

        let new_ans = await removeDuplicates(response.data.ques.ans);
        response.data.ques.ans = new_ans;

        // console.log("faqdata ", response.data)

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
      console.log("not get q_id");
    }
  };

  var setPreviousAnsValue = async () => {
    // alert(1);
    var oldQA_obj = question.answerObj;
    // question.questionid[q_id]

    for (const [index, i] of oldQA_obj.entries()) {
      if (question.questionlist.id === i.qid) {
        console.log("fffffff " + i.ans.length);
        if (question.questionlist.ans.length > 1) {
          const myArray = i.ans.split("");
          console.log(`ans id == ${i.qid} === ${myArray}`);
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
        } else {
          setValue("answer", i.ans);
        }
        break;
      }
    }
  };

  const checkAns = async (data) => {
    // e.preventDefault();

    if (data.ans_type === "checkbox") {
      if (!data.test1 && !data.test2 && !data.test3 && !data.test4) {
        toast.warning("Please select at least one option !!");
        return;
      }
      setExplanationdisplay(true);
      var form = formref.current;

      // =============== check box ============= //
      form.querySelector("#t_test1").className = "";
      form.querySelector("#t_test2").className = "";
      form.querySelector("#t_test3").className = "";
      form.querySelector("#t_test4").className = "";

      var answer = "";
      if (data.test1) {
        answer += data.test1;
      }

      if (data.test2) {
        answer += data.test2;
      }

      if (data.test3) {
        answer += data.test3;
      }

      if (data.test4) {
        answer += data.test4;
      }

      // console.log("user answer ", answer);

      if (question.questionlist.ans === answer) {
        // toast.success("your answer right");

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
        // toast.error("Your answer wrong");

        // alert(question.questionlist.ans.includes('A'))

        if (question.questionlist.ans.includes("A")) {
          if (answer.includes("A")) {
            form.querySelector("#t_test1").className = "right_ans";
          } else {
            form.querySelector("#t_test1").className =
              "user_not_select_right_ans";
          }
        } else if (answer.includes("A")) {
          form.querySelector("#t_test1").className = "wrong_ans";
        }

        if (question.questionlist.ans.includes("B")) {
          if (answer.includes("B")) {
            form.querySelector("#t_test2").className = "right_ans";
          } else {
            form.querySelector("#t_test2").className =
              "user_not_select_right_ans";
          }
        } else if (answer.includes("B")) {
          form.querySelector("#t_test2").className = "wrong_ans";
        }

        if (question.questionlist.ans.includes("C")) {
          if (answer.includes("C")) {
            form.querySelector("#t_test3").className = "right_ans";
          } else {
            form.querySelector("#t_test3").className =
              "user_not_select_right_ans";
          }
        } else if (answer.includes("C")) {
          form.querySelector("#t_test3").className = "wrong_ans";
        }

        if (question.questionlist.ans.includes("D")) {
          if (answer.includes("D")) {
            form.querySelector("#t_test4").className = "right_ans";
          } else {
            form.querySelector("#t_test4").className =
              "user_not_select_right_ans";
          }
        } else if (answer.includes("D")) {
          form.querySelector("#t_test4").className = "wrong_ans";
        }

        // form['c_test1'].className = 'sdf';
        // form['c_test2'].className = 'wer'
        // console.log("chekcans  ", data)
      }
    } else {
      if (data.answer === null) {
        toast.warning("Please select at least one option !!");
        return;
      }

      var form = formref.current;
      setExplanationdisplay(true);
      //  ============== radio ============= ///

      form.querySelector("#t_test1").className = "";
      form.querySelector("#t_test2").className = "";
      form.querySelector("#t_test3").className = "";
      form.querySelector("#t_test4").className = "";

      if (question.questionlist.ans === data.answer) {
        // toast.success("your answer right");

        if (data.answer.includes("A")) {
          form.querySelector("#t_test1").className = "right_ans";
        } else if (data.answer.includes("B")) {
          form.querySelector("#t_test2").className = "right_ans";
        } else if (data.answer.includes("C")) {
          form.querySelector("#t_test3").className = "right_ans";
        } else if (data.answer.includes("D")) {
          form.querySelector("#t_test4").className = "right_ans";
        }
      } else {
        // toast.error("Your answer wrong");

        if (data.answer.includes("A")) {
          form.querySelector("#t_test1").className = "wrong_ans";
        } else if (data.answer.includes("B")) {
          form.querySelector("#t_test2").className = "wrong_ans";
        } else if (data.answer.includes("C")) {
          form.querySelector("#t_test3").className = "wrong_ans";
        } else if (data.answer.includes("D")) {
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

      console.log(`user ans=${data.answer} | ans=${question.questionlist.ans}`);
    }

    // if (data.test1) {
    //   console.log(data.test1)
    // }

    // if (data.test2) {
    //   console.log(data.test2)
    // }

    // setValue("answer", "D")
  };

  const saveAnswerObj = async () => {
    // console.log("form ",form)

    // alert(`${form['test1'].checked} ${form['test2'].value}`)
    // return;
    var ans_type = getValues("ans_type");

    console.log("ans_type ", ans_type);

    if (ans_type === "checkbox") {
      var test1 = getValues("test1");
      var test2 = getValues("test2");
      var test3 = getValues("test3");
      var test4 = getValues("test4");

      if (test1 || test2 || test3 || test4) {
        var answer = "";
        if (test1) {
          answer += test1;
        }

        if (test2) {
          answer += test2;
        }

        if (test3) {
          answer += test3;
        }

        if (test4) {
          answer += test4;
        }

        const ans_status = answer === question.questionlist.ans ? true : false;

        var newQA_obj = {
          qid: question.questionlist.id,
          ans: answer,
          status: ans_status,
        };

        var oldQA_obj = question.answerObj;

        console.log("oldQA_obj  ", Object.keys(oldQA_obj));

        if (oldQA_obj.length > 0) {
          var run_status = true;

          for (const [index, i] of oldQA_obj.entries()) {
            if (question.questionlist.id === i.qid) {
              // var newQA_obj={"qid":user.questionlist.id,"ans":userAns,"status":ans_status};
              // oldQA_obj[index].ans = answer;
              // oldQA_obj[index].status = ans_status;

              var obj = { index, answer, ans_status };

              dispatch(questionActions.answerObjUpdate(obj));
              run_status = false;
              break;
            }
          }

          if (run_status) {
            // oldQA_obj.push(newQA_obj);

            // dispatch(questionActions.answerObj(oldQA_obj));

            dispatch(questionActions.answerObjAdd(newQA_obj));
          }

          // console.log("new oldQA_obj  ", oldQA_obj);
        }

        if (oldQA_obj.length === 0) {
          // oldQA_obj.push(newQA_obj);
          // console.log(oldQA_obj)
          // dispatch(questionActions.answerObj(oldQA_obj));
          dispatch(questionActions.answerObjAdd(newQA_obj));
        }
      }

      console.log(
        `save === test1=${test1} | test2=${test2} | test3=${test3} | test4=${test4} `
      );
    } else {
      var answer = getValues("answer");

      if (answer !== null) {
        const ans_status = answer === question.questionlist.ans ? true : false;

        var newQA_obj = {
          qid: question.questionlist.id,
          ans: answer,
          status: ans_status,
        };

        var oldQA_obj = question.answerObj;

        console.log("oldQA_obj  ", oldQA_obj);

        if (oldQA_obj.length > 0) {
          var run_status = true;

          for (const [index, i] of oldQA_obj.entries()) {
            if (question.questionlist.id === i.qid) {
              // var newQA_obj={"qid":user.questionlist.id,"ans":userAns,"status":ans_status};
              // oldQA_obj[index].ans = answer;
              // oldQA_obj[index].status = ans_status;

              var obj = { index, answer, ans_status };

              dispatch(questionActions.answerObjUpdate(obj));
              run_status = false;
              break;
            }
          }

          if (run_status) {
            // oldQA_obj.push(newQA_obj);

            // dispatch(questionActions.answerObj(oldQA_obj));

            dispatch(questionActions.answerObjAdd(newQA_obj));
          }

          // console.log("new oldQA_obj  ", oldQA_obj);
        }

        if (oldQA_obj.length === 0) {
          // oldQA_obj.push(newQA_obj);
          // console.log(oldQA_obj)
          // dispatch(questionActions.answerObj(oldQA_obj));
          dispatch(questionActions.answerObjAdd(newQA_obj));
        }
      }

      console.log(`save === answer=${answer} `);
    }
  };

  const answersubmit = async () => {
    //alert("123")

    if (Number(question.count) === Number(question.totalQuestion - 1)) {
      //alert("999")

      // ======= checking ========
      var ans_type = getValues("ans_type");

      if (ans_type === "checkbox") {
        var test1 = getValues("test1");
        var test2 = getValues("test2");
        var test3 = getValues("test3");
        var test4 = getValues("test4");

        if (test1 || test2 || test3 || test4) {
          await saveAnswerObj();
        }
        dispatch(questionActions.ansSubmit(true));
      } else {
        var answer = getValues("answer");

        if (answer !== null) {
          await saveAnswerObj();
        }
        dispatch(questionActions.ansSubmit(true));
      }
    }
    // } else if ((Number(question.count) === Number(question.totalQuestion - 1)) && (Number(question.answerObj.length) === Number(question.totalQuestion))) {
    //   if (ans_type === "checkbox") {

    //     var test1 = getValues('test1');
    //     var test2 = getValues('test2');
    //     var test3 = getValues('test3');
    //     var test4 = getValues('test4');

    //     if (test1 || test2 || test3 || test4) {
    //       await saveAnswerObj();
    //       dispatch(questionActions.ansSubmit(true));
    //     } else {
    //       toast.warning("please fillup all answer!!");
    //     }

    //   }
    //   else {
    //     var answer = getValues('answer');

    //     if (answer !== null) {
    //       await saveAnswerObj();
    //       dispatch(questionActions.ansSubmit(true));
    //     } else {
    //       toast.warning("please fillup all answer!!");
    //     }
    //   }

    // } else if (Number(question.answerObj.length) < Number(question.totalQuestion)) {
    //   toast.warning("please fillup all answer!!");
    // }
  };

  const finalAnsSubmit = async () => {
    // alert(question.answerObj.length)
    //if ((Number(question.count) === Number(question.totalQuestion - 1)) && (Number(question.answerObj.length) === Number(question.totalQuestion))) {

    // toast.success("answer submit successfull");

    var currectQns = 0;
    var new_answerObj = [];

    for (var i of question.answerObj) {
      if (i.status === true) {
        var newQA_obj = { qid: i.qid, ans: i.ans, status: 1 };
        new_answerObj.push(newQA_obj);
        currectQns++;
      } else {
        var newQA_obj = { qid: i.qid, ans: i.ans, status: 0 };
        new_answerObj.push(newQA_obj);
      }
    }

    console.log("new_answerObj  ", new_answerObj);

    // var data = {
    //   "subid": question.subject_id,
    //   "userId": auth.user_id,
    //   "ans_data": new_answerObj
    // };

    // var responce = await userService.AnswerSubmit(data);

    // console.log("responce ans submit", responce.data)

    dispatch(questionActions.ansSubmit(false));
    dispatch(questionActions.totalCurrectAns(currectQns));
    // dispatch(questionActions.questionReseltStatus(true))
    // dispatch(questionActions.questionReseltChecked(true));
    dispatch(questionActions.count(0));
    // await getquestiondata(`qid0`);

    navigate("/result");

    //}
  };

  const addBookmark = async () => {
    // alert(1)

    const form = new FormData();
    form.append("user_id", auth.user_id);
    form.append("question_id", question.questionlist.id);
    form.append("subject_name", question.subject_name);

    var responce = await userService.AddBookmark(form);

    console.log("AddBookmark ", responce.data);

    if (responce.data.status) {
      toast.success(responce.data.msg);
    } else {
      toast.warning(responce.data.error);
    }

    dispatch(bookmarkActions.questionReset());
  };

  useEffect(() => {
    // console.log(user.questionlist.ans.length, '  user.questionlist.ans.length ')
    if (question.answerObj.length > 0) {
      setPreviousAnsValue();
    }
    console.log(question.answerObj, "fdlkjglk sdfg");
  }, [question.questionlist]);

  useEffect(() => {
    if (
      Number(question.count) === Number(question.totalQuestion - 1) &&
      question.ansSubmit === true
    ) {
      finalAnsSubmit();
    }
  }, [question.ansSubmit]);

  useEffect(() => {
    document.body.classList.add("bg-salmon");
  }, []);

  return (
    <>
      <section className="Money-Received">
        <div className="container">
          {/* ===== question and exam list ====== */}

          <div className="Money-Received-box">
            <div className="money-header">
              <div className="money-h-left">
                <h6>{question.subject_name}</h6>
                {/* <select id="inputState" className="form-select">
                  <option selected="">Section #1</option>
                  <option>Section #2</option>
                </select> */}
              </div>
              <div className="money-h-middle">
                <span className="page-count">
                  Attempted : {question.answerObj.length}/
                  {question.totalQuestion}
                </span>
                <ul className="pagination-wrap exam-pagination">
                  <li>
                    <a href="#" onClick={handlePrevious}>
                      <img src={prev} alt="prev" />
                      Previous Question
                    </a>
                  </li>
                  <li className="countnum">
                    <span>{question.count + 1}</span>/
                    <span>{question.totalQuestion}</span>
                  </li>

                  {question.count === question.totalQuestion - 1 ? (
                    <li className="end-text">
                      <a href="#" onClick={answersubmit}>
                        End
                      </a>
                    </li>
                  ) : (
                    <li>
                      <a href="#" onClick={handleNext}>
                        Next Question
                        <img src={next} alt="next" />
                      </a>
                    </li>
                  )}
                </ul>
              </div>
              <div className="money-h-right">
                <span className="inc_dnc_btn text-inc-dec" onClick={FontInc}>
                  A+
                </span>
                <span className="inc_dnc_btn text-inc-dec" onClick={FontDnc}>
                  A-
                </span>
              </div>
            </div>

            <div className="money-re-content">
              <div className="content-left question_left">
                <div className="ch-h">
                  <h3>{question.subject_name}</h3>
                  <small>
                    QID: {newQID('00000', question.questionlist.id)}{" "}
                  </small>
                </div>
                <p
                  onCopy={(e) => textcopy(auth.user_id, auth.user_data.email)}
                  className="question"
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: `${lineHeight}px`,
                  }}
                >
                  {parse(question.questionlist.question)}
                </p>

                <div id="monybgwater">
                  <p id="bg-text">
                    {newQID('00000', question.questionlist.id)}
                  </p>
                </div>
              </div>
              <div className="content-right">
                <div className="ch-h">
                  <h3>Select An Answer</h3>
                </div>

                {/* ======== FORM 2 ANS length check =========  */}

                <form
                  ref={formref}
                  onSubmit={handleSubmit(checkAns)}
                  className="qiz"
                  style={{ fontSize: `${fontSize}px`, lineHeight: 2 }}
                >
                  {question.questionlist.ans.length > 1 && (
                    <>
                      <input
                        type="hidden"
                        {...register("ans_type")}
                        value={"checkbox"}
                      />
                      <p id="t_test1" className="clearfix">
                        <input
                          type="checkbox"
                          id="test1"
                          {...register("test1")}
                          value={"A"}
                          disabled={question.questionReseltChecked}
                        />
                        <label
                          htmlFor="test1"
                          onCopy={(e) =>
                            textcopy(auth.user_id, auth.user_data.email)
                          }
                        >
                          <span
                            style={{
                              fontSize: `${fontSize}px`,
                              lineHeight: 1.5,
                            }}
                          >
                            {question.questionlist.choice1}
                          </span>
                        </label>
                      </p>
                      <p id="t_test2" className="clearfix">
                        <input
                          type="checkbox"
                          id="test2"
                          {...register("test2")}
                          value={"B"}
                          disabled={question.questionReseltChecked}
                        />
                        <label
                          htmlFor="test2"
                          onCopy={(e) =>
                            textcopy(auth.user_id, auth.user_data.email)
                          }
                        >
                          <span
                            style={{
                              fontSize: `${fontSize}px`,
                              lineHeight: 1.5,
                            }}
                          >
                            {question.questionlist.choice2}
                          </span>
                        </label>
                      </p>
                      <p id="t_test3" className="clearfix">
                        <input
                          type="checkbox"
                          id="test3"
                          {...register("test3")}
                          value={"C"}
                          disabled={question.questionReseltChecked}
                        />
                        <label
                          htmlFor="test3"
                          onCopy={(e) =>
                            textcopy(auth.user_id, auth.user_data.email)
                          }
                        >
                          <span
                            style={{
                              fontSize: `${fontSize}px`,
                              lineHeight: 1.5,
                            }}
                          >
                            {question.questionlist.choice3}
                          </span>
                        </label>
                      </p>
                      <p id="t_test4" className="clearfix">
                        <input
                          type="checkbox"
                          id="test4"
                          {...register("test4")}
                          value={"D"}
                          disabled={question.questionReseltChecked}
                        />
                        <label
                          htmlFor="test4"
                          onCopy={(e) =>
                            textcopy(auth.user_id, auth.user_data.email)
                          }
                        >
                          <span
                            style={{
                              fontSize: `${fontSize}px`,
                              lineHeight: 1.5,
                            }}
                          >
                            {question.questionlist.choice4}
                          </span>
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
                          disabled={question.questionReseltChecked}
                        />
                        <label
                          htmlFor="answer1"
                          onCopy={(e) =>
                            textcopy(auth.user_id, auth.user_data.email)
                          }
                        >
                          <span
                            style={{
                              fontSize: `${fontSize}px`,
                              lineHeight: 1.5,
                            }}
                          >
                            {question.questionlist.choice1}
                          </span>
                        </label>
                      </p>
                      <p id="t_test2">
                        <input
                          type="radio"
                          id="answer2"
                          {...register("answer")}
                          value={"B"}
                          disabled={question.questionReseltChecked}
                        />
                        <label
                          htmlFor="answer2"
                          onCopy={(e) =>
                            textcopy(auth.user_id, auth.user_data.email)
                          }
                        >
                          <span
                            style={{
                              fontSize: `${fontSize}px`,
                              lineHeight: 1.5,
                            }}
                          >
                            {question.questionlist.choice2}
                          </span>
                        </label>
                      </p>
                      <p id="t_test3">
                        <input
                          type="radio"
                          id="answer3"
                          {...register("answer")}
                          value={"C"}
                          disabled={question.questionReseltChecked}
                        />
                        <label
                          htmlFor="answer3"
                          onCopy={(e) =>
                            textcopy(auth.user_id, auth.user_data.email)
                          }
                        >
                          <span
                            style={{
                              fontSize: `${fontSize}px`,
                              lineHeight: 1.5,
                            }}
                          >
                            {question.questionlist.choice3}
                          </span>
                        </label>
                      </p>
                      <p id="t_test4">
                        <input
                          type="radio"
                          id="answer4"
                          {...register("answer")}
                          value={"D"}
                          disabled={question.questionReseltChecked}
                        />
                        <label
                          htmlFor="answer4"
                          onCopy={(e) =>
                            textcopy(auth.user_id, auth.user_data.email)
                          }
                        >
                          <span
                            style={{
                              fontSize: `${fontSize}px`,
                              lineHeight: 1.5,
                            }}
                          >
                            {question.questionlist.choice4}
                          </span>
                        </label>
                      </p>
                    </>
                  )}

                  {Number(question.radMode) === 1 && (
                    <>
                      <Button type="submit" className="checkAns ">
                        Check Answer
                      </Button>
                    </>
                  )}
                </form>
                {explanationdisplay && (
                  <>
                    <p
                      className="ex-custom-bor"
                      style={{ fontSize: "12px", lineHeight: 2 }}
                    >
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        Explanation :
                      </span>
                      <span
                        style={{ marginLeft: "5px", color: "green" }}
                        onCopy={(e) =>
                          textcopy(auth.user_id, auth.user_data.email)
                        }
                      >
                        {question.questionlist.explanation}
                      </span>
                    </p>
                  </>
                )}

                {/* ======== END FORM 2 ANS length check =========  */}

                <div className="multiple-options">
                  <ul>
                    <li>
                      <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#scientificCalculatorPopup"
                        title="Scientific Calculator"
                      >
                        <img src={Calculatoricon} alt="query" />
                      </a>
                    </li>

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
                      <a
                        href="#"
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
                  <p id="bg-text">
                    {newQID('00000', question.questionlist.id)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 
          <div className="btn-wrap exam-btn">

            {question.count > 0 && <>
              <button className="animate-btn" onClick={handleFirst}>
                First
              </button>
            </>}

            {question.count > 0 && <>
              <button className="animate-btn" onClick={handlePrevious}>
                Prev
              </button>
            </>}

            {question.count <= (question.totalQuestion - 2) && <>
              <button className="animate-btn" onClick={handleNext}>
                Next
              </button>
            </>}

            {question.count <= (question.totalQuestion - 2) && <>
              <button onClick={handleLast} className="animate-btn">
                Last
              </button>
            </>}

            {question.count === (question.totalQuestion - 1) && <button className="animate-btn" onClick={answersubmit}>End</button>}


          </div> */}

          {/* ======== review ===== */}
        </div>
      </section>

      {/* =========== custom script add ================ */}

      {/* ======== custom modal ======== */}
      {/* <SpeedRef /> */}

      {/* <AskMentor /> */}

      <ReportError />

      <ScientificCalculator />
    </>
  );
}

export default FreeExam;
