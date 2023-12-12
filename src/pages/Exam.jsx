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
import Loader from "./Loader";
import logo from "../assets/images/logo.png";
import Modal from 'react-bootstrap/Modal';


function Exam() {
  const dispatch = useDispatch();
  const question = useSelector((state) => state.question);
  const auth = useSelector((state) => state.auth);

  const [loader, setLoader] = useState(false);
  const [speedRefhandleShow, setSpeedRefhandleShow] = useState(false);

  // console.log("questionid  ", question.questionid);
  // console.log("questionlist  ", question.questionlist);

  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(22);
  const [explanationdisplay, setExplanationdisplay] = useState(false);
  const [explanationfontSize, setExplanationfontSize] = useState(14);
  const [show, setShow] = useState(false);
  const [ansread, setAnsread] = useState(false);
  const [answerstatus, setAnswerstatus] = useState(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handlerRemoveBookmarked = async () => {
    // setShow(false);
    // setShowtermcondition(true)
    const form = new FormData();
    form.append("user_id", auth.user_id);
    form.append("question_id", question.questionlist.id);

    //  console.log("remove question_id ", question.questionlist.id);

    var responce = await userService.RemoveBookmark(form);

    //  console.log("AddBookmark ", responce.data)

    if (responce.data.status) {
      //toast.success(responce.data.msg);
    } else {
      toast.error(responce.data.error);
    }

  }
  const FontInc = () => {
    if (fontSize < 20) {
      setFontSize((e) => e + 1);
      setExplanationfontSize((e) => e + 1);
      setLineHeight((e) => e + 4);
    }
  };

  const FontDnc = () => {
    if (fontSize > 12) {
      setFontSize((e) => e - 1);
      setExplanationfontSize((e) => e - 1);
      if (fontSize > 14) {
        setLineHeight((e) => e - 4);
      }
    }
  };

  const formref = useRef(null);
  const submitBtnRef = useRef(null);

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
    // console.log(question.answerObj, "redux question");

    if (question.count < question.totalQuestion - 1) {
      setLoader(true);
      setExplanationdisplay(false);
      index = index + 1;

      dispatch(questionActions.count(index));

      // setCurrentIndex();
      // console.log(currentIndex, 'currentIndex')
      await learningModeAnsDbSubmit();
      await saveAnswerObj();
      await getquestiondata(`qid${index}`);

      setLoader(false);
    }
  };

  const handlePrevious = async () => {
    // console.log(currentIndex, 'currentIndex')
    var index = question.count;
    if (question.count > 0) {
      setLoader(true);

      index = index - 1;

      dispatch(questionActions.count(index));

      // setCurrentIndex(user.questionid.length - 1);

      await saveAnswerObj();

      await getquestiondata(`qid${index}`);

      setLoader(false);
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
    // console.log(q_id, "  q_id");
    // console.log(question.questionid[q_id], "  q_value");

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
      // console.log("not get q_id");
    }
  };

  var setPreviousAnsValue = async () => {
    // alert(1);
    var oldQA_obj = question.answerObj;
    // alert(oldQA_obj.length)
    // question.questionid[q_id]

    for (const [index, i] of oldQA_obj.entries()) {
      // alert(JSON.stringify(i))
      if (question.questionlist.id === i.qid) {
        // console.log("fffffff " + i.ans.length);
        if (Number(question.radMode) === 1) {
          dispatch(questionActions.questionReseltChecked(true));

        }
        var form = formref.current;
        if (question.questionlist.ans.length > 1) {
          //  setExplanationdisplay(true);
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
          if (Number(question.radMode) === 1) {
            setExplanationdisplay(true);
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

          }
        } else {
          //setExplanationdisplay(true);
          form.querySelector("#t_test1").className = "";
          form.querySelector("#t_test2").className = "";
          form.querySelector("#t_test3").className = "";
          form.querySelector("#t_test4").className = "";
          setValue("answer", i.ans);
          var answer = i.ans;
          // alert(answer)

          // var newForm = formref.current;

          // alert(answer)

          // console.log("newForm ",newForm)
          if (Number(question.radMode) === 1) {
            setExplanationdisplay(true);
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
        }
        break;
      } else {
        setAnswerstatus(0);
        setExplanationdisplay(false);
        dispatch(questionActions.questionReseltChecked(false));
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

      // console.log(`user ans=${data.answer} | ans=${question.questionlist.ans}`);
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

    // console.log("ans_type ", ans_type);

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

        // console.log("oldQA_obj  ", Object.keys(oldQA_obj));

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

      // console.log( `save === test1=${test1} | test2=${test2} | test3=${test3} | test4=${test4} `);
    } else {
      var answer = getValues("answer");

      if (answer != null || answer != undefined) {
        const ans_status = answer === question.questionlist.ans ? true : false;

        var newQA_obj = {
          qid: question.questionlist.id,
          ans: answer,
          status: ans_status,
        };

        var oldQA_obj = question.answerObj;

        // console.log("oldQA_obj  ", oldQA_obj);

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

      // console.log(`save === answer=${answer} `);
    }
  };

  const learningModeAnsDbSubmit = async () => {

    if (Number(question.radMode) === 1) {

      // console.log("form ",form)

      // alert(`${form['test1'].checked} ${form['test2'].value}`)
      // return;
      var ans_type = getValues("ans_type");


      // console.log("ans_type ", ans_type);

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
            status: ans_status ? 1 : 0,
          };


          var data = {
            subid: question.subject_id,
            userId: auth.user_id,
            ans_data: [newQA_obj],
          };

          var responce = await userService.AnswerSubmit(data);

          // console.log("single ans submit done (checkbox)")


        }

        // console.log( `save === test1=${test1} | test2=${test2} | test3=${test3} | test4=${test4} `);
      } else {
        var answer = getValues("answer");

        if (answer != null || answer != undefined) {
          const ans_status = answer === question.questionlist.ans ? true : false;

          var newQA_obj = {
            qid: question.questionlist.id,
            ans: answer,
            status: ans_status ? 1 : 0,
          };


          var data = {
            subid: question.subject_id,
            userId: auth.user_id,
            ans_data: [newQA_obj],
          };

          var responce = await userService.AnswerSubmit(data);

          // console.log("single ans submit done (radio)")

        }

        // console.log(`save === answer=${answer} `);
      }

    }

  }

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

    if (Number(question.radMode) === 1) {

      await learningModeAnsDbSubmit();

    } else {

      // console.log("new_answerObj  ", new_answerObj);

      var data = {
        subid: question.subject_id,
        userId: auth.user_id,
        ans_data: new_answerObj,
      };

      var responce = await userService.AnswerSubmit(data);

      // console.log("responce ans submit", responce.data);
    }

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

    // console.log("AddBookmark ", responce.data);

    if (responce.data.status) {
      toast.success(responce.data.msg);
    } else {

      toast.warning(responce.data.error);
      // handleShow();
      handlerRemoveBookmarked();
    }

    dispatch(bookmarkActions.questionReset());
  };

  useEffect(() => {
    // console.log(user.questionlist.ans.length, '  user.questionlist.ans.length ')
    if (question.answerObj.length > 0) {
      setPreviousAnsValue();
    }
    // console.log(question.answerObj, "fdlkjglk sdfg");
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
    if (question.answerObj.length > 0) {
      // alert("ok");
      var score = 0;
      for (var j of question.answerObj) {
        if (j.status) {
          score = score + 1;
        }
      }
      dispatch(questionActions.current_score(score));
    }
  }, [question.answerObj])

  useEffect(() => {
    document.body.classList.add("bg-salmon");

  }, []);

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

          <div className="Money-Received-box d-header">
            <div className="money-header">
              <div className="logo">
                <a href="/practice">
                  <img src={logo} alt="logo" className="footer-logo" />
                </a>
              </div>
              {/* <div className="money-h-left">
                <h6>{question.subject_name}</h6>
               
              </div> */}
              <div className="money-h-middle">
                <span className="page-count">
                  Attempted : {question.answerObj.length}/
                  {question.totalQuestion}
                </span>
                <span className="page-count score-count">
                  Score : {question.current_score}/{question.totalQuestion}
                </span>

                <ul className="pagination-wrap exam-pagination desktop_mode">
                  <li>
                    <a href="#" className="desktop-link" onClick={handlePrevious}>
                      <img src={prev} alt="prev" />
                      Previous Question
                    </a>
                    <a href="#" className="mobile-link" onClick={handlePrevious}>
                      <img src={prev} alt="prev" />
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
                      <a href="#" className="desktop-link" onClick={handleNext}>
                        Next Question
                        <img src={next} alt="next" />
                      </a>

                      <a href="#" className="mobile-link" onClick={handleNext}>
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
                    QID: <span>{newQID(auth.user_id, question.questionlist.id)}</span>{" "}
                  </small>
                </div>
                <p
                  onCopy={(e) => textcopy(auth.user_id, auth.user_data.email)}
                  className="question"
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: `${lineHeight}px`,
                    textTransform: "initial"
                  }}
                >
                  {parse(question.questionlist.question)}
                </p>

                <div id="monybgwater" class="mwatermark">
                  <p id="bg-text">
                    {newQID(auth.user_id, question.questionlist.id)}
                  </p>
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

                <form
                  ref={formref}
                  onSubmit={handleSubmit(checkAns)}
                  className="qiz"
                  style={{ fontSize: `${fontSize}px`, lineHeight: 2, textTransform: "initial" }}
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
                              textTransform: "initial"
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
                              textTransform: "initial"
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
                              textTransform: "initial"
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
                              textTransform: "initial"
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
                              textTransform: "initial"
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
                              textTransform: "initial"
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
                              textTransform: "initial"
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
                              textTransform: "initial"
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
                      <Button
                        type="submit"
                        ref={submitBtnRef}
                        className="checkAns "
                      >
                        Check Answer
                      </Button>
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
                          textcopy(auth.user_id, auth.user_data.email)
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
                      <a href="#" title="Add Bookmark" onClick={addBookmark}>
                        <img src={add} alt="add" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#searchpopup"
                        title="Speed Reference"
                        onClick={() => setSpeedRefhandleShow(true)}
                      >
                        <img src={search} alt="search" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="/practice/translate"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Translation"
                      // href="#"
                      // data-bs-toggle="modal"
                      // data-bs-target="#mtranslate"
                      // title="Translation"
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

                <div id="monybgwater" class="dwatermark">
                  <p id="bg-text">
                    {newQID(auth.user_id, question.questionlist.id)}
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

          {/* ============= mobile view start ================== */}

          <div className="mobile_header">
            <div className="mheader">

              <div className="logo">
                <a class="" href="/">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALwAAAAvCAYAAABZu6BGAAAABHNCSVQICAgIfAhkiAAAG9BJREFUeF7tXQlUFFe6rqruBhEFcUPQxCUqCAi4REHEuG9xB6S7IRqT6DiTxMnkTWL2ZMw2Sd5MjtnNzIuC0N1AXOMSJSooiqi4sLggKqMoKAqisnfXfd9twcdS1V29IOrLPYdzgLr3v9tX//3vvxXLiJSIiAhZYWGhQ9euXZ1dXFy6cxzXmee59np9tQMhHCvWzpb/l5VdP52cnHy2noZs9uwFkU7tDcvwtz9+2jEMKSI8m3jrVun727dvv2VLX63RdtasWZ7Ozh0+5xn2aSyQK/q4wRAmpbS05G87d+7MkdJnw7rfunXLaejQoe4VFVxnJyfGudZQo2B5lpNCw9I61dUVhzZv3ny1vh07btw4/+49PF5lGXYc/tcTPwaGkAusjP2l4HzRl+npuy9b2kfj+sOGDVPg7/Y+Pj6edXV17jKZzKmujpebo6lQcPqMjIz9vaLza2c8/VQopzcAE8IF63/7L/9M28ckYeyNSnPgsmPHjnXv0aPHHIaVTcNm+TMs8xjqy8wNxh7PMZh3tNr4jymt+fNVKk7GrRXqmzDkl+wTx8NPnjxZa49+7UEDQO0skzlsxXoFCdArOnb0yPAzZ85cEetrxIgRXfr16z+TsMwMlnABDMv3YRjWLAjsMPZTRzMPj8nLy7tOaYWFhUUrHBx/QN/OgrQJuVRScjVs165dhy3tu9+wYa7D+g1SyxVMJCFkONoL9yFOuCI763iIe2jd9RkLPTNAg76MYkVv4PlPtr2z78OUFEbfUOke4Pv06dMuOHj0y4Rh/guc1N3SydijfiPAcyp1dCImFCZCl0fdj/ByvG+Pfu1AQxGpjP6eZcnzQrQwD5KTnbMoNzcrpvlzcDkHPz//5ziZ7G0862WHsVhAgq25Wnw5cs+ePZtoo6lTp47t5NZli3kgkoIb10tCcBqLvsDNBzFlyhRft85dwMDYIRYMsHlVSwAP3sMaGI75NP7FlBWZmUwdJWYEPAV7UFDI9/jrWRsGY3PTBsDjlJF7evbczBNmmgmiVTeu31AmJ/+62eaObSQQGan6E8txX4OMmMhBAf+nnJwT4JxNilylivqCYdlleCdaRVwxNTWWIbFarWYR6vDAQKfgUSF7CGECpSwH9ioODGchbWuu/sgJE9z7ufdIBW0vc3XNPLcI8EaAs6xBz5O/vB6SSvfHCHhWpVK9Shjuv20cjM3NmwK+1yaekOlmiF66cf3ahEZyv81jsJTAtGnTQlw7uf2KZexgoq0g4CdPnvZc5y5uq+6T6NJ0eIQUnjqVG3TixAmjPK5Uqj8GOt6sx4SUZdCD4YRJYDjsfGX0pxxLlkshak/AswAUJJbM42llEWtfy7pgBPzcuXO7tHNyPgkO090OA7KJhBWAR38k9cjhQ7Py8/Pv+yX2scdmeYaEuOxlWPKEmYm3AHy/iAjXEXKHg2jnbdOiWdeYL7xU+GxaWiq9IzEQN0a4de6ajF9dLCLHMvlpe1NHQrlRKtbO39/f2cfX/wz2yZS8LbVbyRyegp3nmcN5+0rCf3zj5MWGDsDdFywkjGGNuR5xNOCiTqgcdAfvidljzBy9ls9xFcUlIyFB+8+7Io0kDk/J4J7HrMTxiruH+ePV8nEJt6CahgFe3pvAQkyJXQ2NWwB+xowZ0zt0dKXimEmFQP2668Gp7hhlUpsL1plhdydo49QgpXd3d3ceN27iFpz1Y60gTSDKfaONX0s1aYIlLEw5XOEgO4SHpjR7xYCX6EvTQBgnftXJnOzo7kNKS55eOuAfuDO5ifULTVnpqb2F7/57eX5h4zoAfNQaLCaVxYQLYYsJ4d+vqrqTmpOTU6xQKFoB7He7hnqqhmpeLAQ8bVpXfrN80fbtW+Kt2DSrmrz22syPLxW6vIHGUmTvFoCPVD3zGcvwr5vovBYc5luFQqbBpfJ8u3bt9FgfbJXtxWAw1OJErKGUVFFRrxCe+acoIFlmP94QPzynatYWhRC20sDop/6s0+0Teq5Uq58BS6KXdSHAX5HLFMrDh9OP3759W9LLfOXKlWrQIsOGMSY1WB07MqSxdqZhbKxSHZWJCQ0VnAx0mYUXC4L379+fa/syS6dgBeAp8dLbtyqf2rp1gyR9t/TRtKw5bebMOa4dXLR4IqoHbtaqJeAj1cksx04UGYehqrJq6aZN63/C81ZjMDhlBuCUoWJVZ6Fx4Ey/ce5c/pNQly6EfC+qEQOSM3fv/u2pq1evVjSnA/Xy61AvfyZIn2OWa+PjP7dlLyxty0Yq1ddwbHYTasjzZHViguaF1lx0oX6tBDy9kh89e+bU+MzMzHJLF0Jq/U8++cQ7Kzt3N+p7SG1DOVJjLQ0VhwZ6DUqHiDhMmNGQYwlaDdXnt5qdgapDBwcEJkBMmiMyD97VpcMrq1at+nrw4MFuPn6DU1CXGgBbFOCHv1Ve/t7Wrb8YbSiNi1KpXAGbzrvN/09FNYYYJmu1Wnp3uG+FVaqisaiEWr5aFBnHvBgfH//dfRtNfUdWA562J8wane7yYoZJuWdssNf4+/fv7zJ8xMht6CPEQppNAO/l5dVx6LDhB6Gm8xGkw7Jf6jRxr1rYh0XVIyMjoziZIlZMHQpR5UCCLo5aWo0vXXBw8NTeffpRfb2DSEdlOcyJsTnanKxmgP8QgH9HCPA1+trR6xMT91s0cBsrA/BR4nIhx0To4uN/trEPi5ubATwPwOFOIirD8Q4KxcuxsWvs/aLK1Oqob2AbWGpiQvRSL8Q8mgA+MDCw0yAfX3B4YQ0Nb+D+nJi49iuLF05iA3D3Hv4BQ4+CO4icUmz1hfNPjc7IWJzZiKQMWPkf/C1+32OZnUcOZVCNmfF+QMt8pfJDTgTwRCGbqIuJ2SVx2HapZhLwuFDMjYtbs9EuPVlAxBTgAZJyyJZfQ3xpwTUadVFRfrN0IvxtqHxqlxKpil4ED6JV4IiCpyE6uYZLZiy0Fn9FneZ9WgR46Kz/oNFofrTLwFsSofe2GDCNZ8ToY/SfJ2jj6YW8yUQgij0+YID3ATAbQRUjNfLIHBVL41av/ncDbbVa/RZP2BaiDn0OoeYtaNc+baV5CpJ96ACPWZQZ9LWPy+UO8diNWeKLRc5lHEwPuXDhQoNTlNXrGjY9bLjCtR3lRGJ66rrz585G9uvXz5Xl5KsfZMCHT585Q+7qsh5zEXlx2bzCSwVBaWlpZUILplZHL8Eph9OTCKpTIZoXnTh+LAjaNqPuG0qa53nC33sBmtG8VVld+bfK2zXJHKe/WVtrmxZKJqutgo8Pvb+JirMPJeCLiy53r6io6Np/gFcKwCVqrsazLQk6Db2USVJ5CW2wt/c3XQKGpO8HNxLrh4CDfZqoi3sX1soF4PAPLOCp+8DIoJDDAGV/sbefN5CnExM120xwBwXufbAsk/GidQjRFBdfWZiSkqJfsGBBcG2dgcrpgnp4euEF46qmp4PVHKmhIfTn6MZAeEMZw3JZ5TdvbM/Ozo6DYayqocpDC3i6mNAAjMSF6DdMRsysz1dX1azYuPHnv1m5mNx8VfQ6jiFimgxK9tcjhzPmULkVgH/2QQa8Uhm1ErB7WQx8sChoiy9fXkDX1tR6QbQZPGCgdwbqOInUM9Tqa+etT0ra7O8/GZbWbnmo52nlHljdDC+2AZfv4prq6uUbNvxstNE81ICn41epop+H7fBfJlaluq62es66det2WLpySmX0W3Ab+EgUICxz4WTOhaCsrAPXKO0HGfBQLY7x9fMHZxYF6dVz+XmjDh8+fF7KOmGuUDca71HCFlTCFBw5kh+Qn59xOzIq6i3Y5uk6tlWpk3GKZfHxa3542AFPF1AGzkU9PaGKFC7YkUtHjx55Cv7oRgciKWXOnPDJ7ZwcqRpOzLhUq5BzIWvXrj3SQO9BBXyvXsFOIaH9DmAdRD0hYfV9ETpxyZotcPn2/Qd6HzUh6kHqIV/pdJpXUNcJbhgJuALPkLL2rVTnTm1N1aBHAfCM0UHJxy8FHIcGFQgWbMyefftSn24sz4nVBb1ePr6DKZBF4wLqNSn0ZLmnyXhQAY/glLdlcocPxU8qNu3IoYMTG6sTpYBu/vz5E6HLp6eGmD9QXU117fgNG5LSPvjgA4fTeXkvws2AGqE6iY5FSsfW1iHkvUcC8HT+AKkXQLoXv4p6fcLj/B8J8fGvNQZp87WjFkj/wMDd2BhR4xJhyb8TNAP/wDAfNDH72wvwuMDFwpEOc7Ey0ExOSnRxccY4AT9El/gNDqDrIugLAyZRefpkziREXFkcwYQoKZm7p+ePLGFFVZxgBzlZWceGNYpOcwwMDPLw8ek/g2f4ETzhHmcJ6YgT2srJ3t1BMDQ55PVOcCijdwURRzU27ZEBPJ10hFI5S8bKqKFMUOVm1Ajw+nCdTrdBjElAb7wSWhfxix1DDl04f24SYitbuCPbC/DWMrD6dvzpU7lhx48f32h8eQOGbjepUcFDjmPhkMVa5ZgGTRiARsSsr3RIxKDXf5CUlLDCxnlJaa4Ii144V2EwxKJbxxYNCCl5pABPJwh5Hkc3eQecS3CB4A8CfS8/Yt06TUOw+L164eHqKJmCiUEdYR0zjEsImhgNMLVoe7dv+2hppOysaB2WQBOrUVGgwX1gCUSOHwBIU665NnUnqTEhd3Jzs0dBRZgtqb6NlcC0ZiOgSYd5N79/GR5G14Iyqoc3oTqDKlG9jWPYKWLrBlZ2Yv++1ODG8vyyZcv8SkpK90HjQ+VLoVLLMly4Vrv2FzG6bQ54wpRCfPCF+FAM7v54QMDQTMynq434sVNzNlWnNfrmWHWSWDoIpXLh0wyrT0K7JqpT6jyG40yA/dORydiXE+LivrG0M1vrm/GlMQd4xtfXt7O/f8BRBDr0FhsL3BNWI57zOfqc+rZ4e/vug+RH/b4FC0waKxISTAeNtzXgcZFeCJeEWJrqg1M4aiEbR9i6F3Zsj2OG/yM0QQhpvC9FplKrN+NwaxImSjk8jTwXdCKC78hajSb+WTxvNZ9soanbCnhKE5E2QxQOchhHhH1faCYBvUL2B666+ieAIwbgiBI/EdhtiBCibgwmrYFtCnjC/Hr27OlZcI2ui45eGKY36O+7058EGF/Nzcmioo0kXb8EeoJVqPt1/4FesRBNlc0rwB8+Kh3irlAuFcrjax0U8qDY2Nhj1nZuTTt7AJ72GxkZ/QLLEeqEJSbD3gHb+RnXNfpSi/H2/xzKOxNwXoKPvb0AD1t7IS7YN0yMu+lYCaNnGX0YLuMF2GxXOHidxox7iE0IYk42FsSYh8aehfoIYNxDQVtMLKQCDYKj4udTcNmz7wZacOF2HD58ZBzmHy5Avw6ec+rvoIL7o4nOa7FA38tY5iu5XF6OBGSGmzdbY6gMA8VCdUFBQbW9AI9RciqVehVEGxrEYnEhUNnVGepC1yckwJXWfLEX4G3wlqQhm5ivuBEOQDiadfxYcGslsZo5c+4M5w7tqRZMNATP0UE+OyYmxqg23bZtm+OWLVvEPFDNLzpqVFdXs7flco6pquos0xvgqMaK+fkUsXDumQ3nHqkuwFQSoG9xq7yd4Azv0cxjdgQ8Q4M2nnxyRDJGPULS6v1fJR4BMIsRAEPD7CSVtgY8fIsmQMFEDUFiYKuDkjAUJwH1g2m1Ak1ZPF4sGiQuWCBRnM3NyR6dlZV1LXrhwvl1NXXxwJSU2GDRMVNNFC2mJgURZzdLTcQDBnjlAsV9Wm0FJBKWmKbD7KW1eXfe3gEDhwwdvM+iVCSE/ACz+IugJfn+0paAp9Zm+MpkmvIehaodkVQamt2hVRhWw7ojosszcOjww9hPUYcxxPB8naDVvkLHgjDTDcDqbIkwsboaL2PfML4RUVELIg28gXqT2WTtsnok9Q1bC/CUPHImzlE4OOnENFJNxk7YgwcPpo2j4pUlc2pDwEtJdnQeF8bhuDAK+rlbMk8pdcPDIxfIFXJ6OophCglaDWNw2hyYN29eb4Wj03GTsr+UTk3UASMor6rkfRqOAC5CFfmmjJHTyHSb5ClbxtWagKfjmjsv/GMHB8c3cfCJH30sc+X21ZuhW3dttViT0FaAR5bhoIHePrvgrNVeZP0NVTVVEZvWrxe1MNuyb2JtVZHqrUg0bSJ7HHvsZG5WKESbivp0hVQFbncjGU6POgQtLMVl+acmxGfOCZ/m7OT4Bf45EGfefQd+awO+PlJ/A/AusglsTUXVnbm/bNwIc7zlpS0AP3Zsn3Y9PEYhiwIbLD5iNrG4qDDKnJ+75TM23QJiVl+IWUfBXU1obWTv6XSxHyE4xTE4OGQbcEeNU/YqEOyZopqK2lfXb0pKBNGWJmeqw0RO+CFubt1mw9lqEiyWPXBHdboby8nSGCybLhemZgLCKzSauM/qL61JEJ4nt6iPmFZs3uPWbl7fvn3dRwaNSgHdJinuKBcAh6Tpuq3OkwLAP4MswD8gQ1aTYeNFRkzrib9AnDD67VPVoZfXoBTMb2Dz+XF301csgwGJBkybLcgL+jJhZX8Xrcgy17OPH5uQm5ubb5ZYK1SIiFC/JFdwf6caSyHyMABW5V2YODozfdFppH0McGzXfjfuk1Lz/dwjSVcNfxiwfLVQj1ZCs5hbU1m99iainoCVe3pFs8cHrHYORZWVzi6EOFJHISSwx7cRuFa59HTr1q0cWhGjUxaSlHZDhqwWE69F9q2U7dubpE+zdJ+QS7Gzq1uXNwGuaQgFU7DEUFRRXfX3zRs27AQtyZfU5v1OnvyMM88XdRFaH7gxlEEViDSFxsJhDO50PZvT4HmedXNzK01KSmqoa3J6E5CZFy+ro1CflBbHdazeuXODMUCljYps8uTJJqOdMIeby5cvv43xsfi9OzKsmXJGE3+3WVYP1Xn11q0VoCUctWUW8G20SPerWxYvNAdw2R5Peb9G/Hs/Nq3A/3fA27R4vzd++Fbgd8A/fHv2+4htWIFHBvBRixb5GGprB+PDXyQv79QOqfklR48e7ebRq/dYGUNwgWTvOLl22LN61arT5mR5XKz7eHj0GkFloTMns/c3fFhAbC9Qv1OPnj2nUPczyO48DIslZ8+eysE4qc+MyTsR/LunQxzv2Ji2DNrtY8eOpVJXYKE+6Tej+vb1msTIDFWncnJ+o6q/6OjoUXo9wTe7DOeg/74Xi9u4PQKug5AwozfHyfM1mhhj5jFqnIQxaRJ+dTh37twOoeAXGzB4X5s+MoCHOfsXZOOdQV0fOJZbpNGsXWNuJUNDQ/179uqdhJv9QLSj2IWiiEWaaqMj1lZT7SNVqi+RQu4VilSOYz7UxMW9Z6o+QBuIkRmd8Kh/BjWDY6glCOVblpCgSTAFemh/8nD7HNCYPrWi4wNf06H5EVSh0nwwegM5gBAvw8WCC6EHDhw4FKlUZXOcbBB00v+CTnqJ0HinT5+pcnV1icOzsydOHPOnPjfQBM2Egg6utkzGrt92TCwpKZF0oTa3/m3x/JEAPA26hr6XugLfxKb0hUpqB7LvzjMFIh+fiA4BgQ74EhwzCKqxXQUFl77t3LlTl44uLqHIM7PMzBdFHBBHkA1TPVXReoLGOaSmoxkBRDU8EQC8jLDHqF64/GbZX11d3cbgZVmENkgcpB+dYMJBDUA9gxNhwM3y8i9vl5cZk5XSd+bixYvJ0P4IfkIy6tlng/ha/QHji0zYFTk5xzf5+gekwgvKFXaIH7XaOMEcmcbMxgO9D2Fsg/9TeDG8trJya38vr40cFEulN0vVO7Zto/rsh7Y8EoAfFRoa1vux3j/zxPAmIjSfB6i6I66zN0LxRP06n1u8OKzyTmUSwHppf1rqEFOfbWm+u76+gSGD/X2TERQSi776QsMcmnUqd9RJdCiGhAbAQxWaf+bMqQCIMlWRKnUSwBcGJ7WvoI41+pUItW8AfGV1TfiRjAPUOYxp3769wVSWgXrAp8MmkI0+S3gDv4GTsS/hPemDTV8jBnhKe+rUWcpObh2RypD8WnS58A3Pno8fxhyzdiXvGP8wc3c6t0cC8Djy43Hkq6+VXh/RvXPXJeBqz+EbRkp8w4iGeAmWqKiojww88zY2VYfTgMaASi40CRH6exfZC6KQYOhxoPQTRweHN2JiVosarQQAX4mM1fj6H/MtcJ5cXHRlupgxrR7wELvYyzCBGMUJ9LlHp4kXdeumgCd1hnTo4uMg/oyHGHMJu03dJWbiJYs3BXjqU/7kkyMPog+aki8N7SeV3ihdsGPHNo3kRXpAK7LIimuVr3hbz4djDOkIF8tFGgp3P/+AdIzHufjK5dndPTzGwTr8MeRlDaKUok0A/nMA/jWAYA2AQ0ULqUWB0LFDEBP8LxVdnuDp4eGB45463h3SaeNFAmmQUaFepGnE4Ssj1eolSHFBv+K3G9bjKeYADwvkRQj+dwFPSCq8Of8kOj8q0gDwqEe/vhGGD2g9gRNpKcD7JX7WmgI8pTl3bqTSsZ2cAhzvB3t0z67kMQ1f+AhTLfCXI8WG1AV7kOqx1L/kQRqQ1LHgMkXzH/L4TPoU9x6e9Jin8nMNgAi8E0fs0rWiosInACLBC1bY/PkvKmQKOCuRLJ1WQxM4GT9ca67gvjAU+W9SUY/ms6RJOukpSS3C5bhEjoIJ/6QQDSHAI1jjB3BR5LfhftJp11LGY1KkQWBIOLIhGy+p5eXlBlNBHA0iDUD+Aa7ij4FyKM/ySznCbsPaxJgDvNFtfKA3FdEGlJVeX7Jjx47G6QxlwE2betaa2yex5w+9SANf6lUwqy/hDQZoaZgcZBYA00TwASGeOdm5c/ExYPpl6RZl/PTpvd07uWVDhm+Pup+Wld34Eq4MHbp2777wPxcufJueni74VTmki/4rUPkFOGaaXm9I49o5MpxePx0BJv5XLl9+ae/eFIgoLUujS+v5q8VFY5Bae8ydiqrvUbMjtEozoVUSzdjbIMMr5IqFXbp0osljjSUxcV/5lSuZlUL9NQAec/v4+vWC72pqZO7Xr5crAgL9UulHxiQAXtHfy3sPMvngJc6eB22Q1CAha7F4X9o91ICn3x7y8wvYDzl8QHVVxZMbN240XhqR8H8lONoybPaPOPbBQQULC5/tP8Jn+x/1HJpyeEgcNFsTeRtaFyGHLHw5OxrOTUyogbCzEutTdkCmX4ZjfyWC3nch6F3wQ2UNgKdc/K4e3pj7Bqk/yPfInkCzoYmeMKB/BvSpo9m9E6D+G0kvieWDvCfDGwyfYA3oZ+2ZgICAET6+fqnoPVanixNbF+Ni1X+Wcw/9vA/86Of+Dvj78j6a7mTMmMl9PXt2+w6Av3bm1Mk/N2hl1OoF43jG8BrDkyvYbFN3FHbSpEnju3Tp/jpAPAybe00ul61KS9u7Sij4o/6+sBKjckZ/z8HwU0JHuHjx4oG37lR+BY3NjewTx1+GWNPidEBSpCcYTv6t0avP+Mlb5mLBjZJ1GTt30g8tmHRYQ1zuv9CoV5PVwFGGk+xrpA4UPMFeeOGFQXcqKleiK1xQtTG0LU1HOMjX7wvIfMnwCjV+il2sUI9VDw/Pz9CvDwC/AoCn96SHvvwvc3Qi0v20nKoAAAAASUVORK5CYII="
                    alt="logo"
                    class="footer-logo"
                  />
                </a>
              </div>

              <div className="inc_dnc_btn text-inc-dec" onClick={FontInc}>
                A+
              </div>
              <div className="question_subject">{question.subject_name}</div>

              <div className="question_id">
                <span className="q_title">QID:</span> {question.questionlist.id}{" "}
              </div>



              <div className="page-count">
                <span>Q </span>
                {question.count + 1}/{question.totalQuestion}
              </div>

              {Number(question.radMode) === 1 &&
                <div className="page-count">
                  <span>Marks </span> {question.current_score}
                </div>}

              <span className="inc_dnc_btn text-inc-dec" onClick={FontDnc}>
                A-
              </span>
            </div>
          </div>

          <div className="mfooter">
            <div className="check-answer-nav">
              <a href="#" className="prev_arrow" onClick={handlePrevious}>
                <img src={prev} alt="prev" />
              </a>

              {Number(question.radMode) === 1 && (
                <>
                  <Button
                    type="button"
                    onClick={() => submitBtnRef.current.click()}
                    className="check-ans-btn "
                  >
                    Check Answer
                  </Button>
                </>
              )}

              {question.count === question.totalQuestion - 1 ? (
                <a href="#" className="next_arrow" onClick={answersubmit}>
                  End
                </a>
              ) : (
                <a href="#" className="next_arrow" onClick={handleNext}>
                  <img src={next} alt="next" />
                </a>
              )}
            </div>

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
                  <a href="#" title="Add Bookmark" onClick={addBookmark}>
                    <img src={add} alt="add" />
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    data-bs-toggle="modal"
                    data-bs-target="#searchpopup"
                    title="Speed Reference"
                    onClick={() => setSpeedRefhandleShow(true)}
                  >
                    <img src={search} alt="search" />
                  </a>
                </li>
                <li>
                  <a
                    href="/practice/translate"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Translation"
                  // href="#"
                  // data-bs-toggle="modal"
                  // data-bs-target="#mtranslate"
                  // title="Translation"
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

          {/* ============= end mobile view start ================ */}
        </div>
      </section>

      {/* =========== custom script add ================ */}

      {/* ======== custom modal ======== */}
      <SpeedRef speedRefhandleShow={speedRefhandleShow} setSpeedRefhandleShow={setSpeedRefhandleShow} />

      <AskMentor />



      <ReportError />

      <ScientificCalculator />
      <Modal show={show} onHide={handleClose} className="sub-mdl">
        <Modal.Header closeButton>
          <Modal.Title>Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            Question Already Bookmarked
          </div>

          <div>
            Do you want to remove the Question from Bookmarked ?
          </div>
          <div>

          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={handlerRemoveBookmarked}>
            Yes,delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Exam;
