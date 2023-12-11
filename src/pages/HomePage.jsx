import React, { useEffect, useState, useRef } from "react";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Image,
  NavLink,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchama } from "../schema";

import { QuestionSchama } from "./Schemas";
import TokenHelper from "./TokenHelper";

import userService from "../services/user.service";
import { toast } from "react-toastify";
import learnig from "../assets/images/learnig-mode.svg";
import exam from "../assets/images/exam-mode.svg";
import leftbanner from "../assets/images/login-left-img.png";
import { AuthContext } from "../App";
import LoginPage from "./LoginPage";
import { useDispatch, useSelector } from "react-redux";
import question, { questionActions } from "../redux/question";
import { removeDuplicates } from "../common";
import { Tooltip } from "react-tooltip";
import { Range } from "react-range";
import Updownarrow from "../assets/images/up-down-arrow.png";
import MobileSelect, { CustomConfig } from "mobile-select";
import MobileSelector from "./MobileSelector";
import Modal from 'react-bootstrap/Modal';
import logo from "../assets/images/logo.png";
import { authActions } from "../redux/auth";

function Home() {
  // const { user, dispatch } = useContext(userContext);
  const tirggerRef = useRef(null);

  let msInstance = null;
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [Dropdowndata, setDropdowndata] = useState([]);
  const [ChapterDropdowndata, setChapterDropdowndata] = useState([]);

  // ========== mobile view state =================
  const [MobileDropdowndata, setMobileDropdowndata] = useState([""]);
  const [mstep, setMstep] = useState(1);
  const [mminstep, setMminstep] = useState(1);
  const [mmaxstep, setMmaxstep] = useState(5);
  const [selectedVal, setSelectedVal] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [selectedCourseVal, setSelectedCourseVal] = useState("");
  const [lstNum, setLstNum] = useState([5]);
  const [switchrandom, setSwitchrandom] = useState(0);
  const [switchclear, setSwitchclear] = useState(0);
  const [Switchexammode, setSwitchexammode] = useState(1);
  const [lstSubjectError, setlstSubjectError] = useState(false);
  const [lstlstNumError, setlstlstNumError] = useState(false);
  const [show, setShow] = useState(false);
  const [showtermcondition, setShowtermcondition] = useState(false);
  const [alldataform, setAlldataform] = useState({});
  const [modalmsg, setModalmsg] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [showchapter, setShowchapter] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  //  =========== end mobile view state =================

  // const [Dropdowndatavalue, setDropdowndatavalue] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(QuestionSchama),
    // mode: 'all'
  });

  var Navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFreeTrial = () => {
    setShow(false);
    setShowtermcondition(true)
  }
  const termconditionhandleClose = () => setShowtermcondition(false);
  const termconditionhandleShow = () => setShowtermcondition(true);

  // ========= free question submit ==========
  const handleExam = async () => {
    setShowtermcondition(false);
    var data = alldataform;

    let chkRandom = data.chkRandom;
    let chkHide = data.chkHide;
    // alert(chkHide)
    if (chkRandom == "true") {
      var checkRandom = "0";
    } else {
      var checkRandom = "1";
    }
    if (chkHide == "true") {
      var checkH = "0";
    } else {
      var checkH = "1";
    }

    // var checkRandom = "0";
    // var checkH = "0";

    var no_of_question = 5;

    const form = new FormData();
    form.append("lstSubject", data.lstSubject);
    form.append("lstNum", no_of_question);
    form.append("chkRandom", checkRandom);
    form.append("chkHide", checkH);
    form.append("radMode", data.radMode);
    form.append("type", "filter");

    var responce = await userService.FreeQuestion(form);

    if (responce.data.error) {
      toast.error(responce.data.error);
    } else {
      // console.log(responce.data, "jghjgjg");
      // console.log(responce.data.question_ids, "jghjgjg");

      let new_ans = await removeDuplicates(responce.data.ques.ans);

      responce.data.ques.ans = new_ans;



      dispatch(questionActions.questionReset());

      dispatch(questionActions.questionlist(responce.data.ques));
      dispatch(questionActions.questionid(responce.data.question_ids));
      dispatch(questionActions.totalQuestion(responce.data.question_count));
      dispatch(questionActions.subject_name(responce.data.subject_name));
      dispatch(questionActions.radMode(data.radMode));
      dispatch(
        questionActions.speedRefFileLink(
          responce.data.speed_reference_file_path
        )
      );

      dispatch(questionActions.subject_id(data.lstSubject));
      dispatch(questionActions.flag_type(responce.data.flag_type));

      dispatch(
        questionActions.passing_percentage(
          Number(responce.data.passing_percentage)
        )
      );

      Navigate("/free-exam");
    }


  }
  // ============ desktop view submit form =================
  var submit = async (data) => {
    //alert("ok");
    // if (!auth.isAuthenticated) {
    //     toast.warning("Login Is Required!")
    //     return;
    // }

    // alert(1)
    // console.log(data);
    let chkRandom = data.chkRandom;
    let chkHide = data.chkHide;
    if (chkRandom == "true") {
      var checkRandom = "0";
    } else {
      var checkRandom = "1";
    }
    if (chkHide == "true") {
      var checkH = "0";
    } else {
      var checkH = "1";
    }
    setAlldataform(data)
    if (!auth.isAuthenticated) {
      setModalmsg("You are not logged in.");
      handleShow();


      // const form = new FormData();
      // form.append("lstSubject", data.lstSubject);
      // form.append("lstNum", data.lstNum);
      // form.append("chkRandom", checkRandom);
      // form.append("chkHide", checkH);
      // form.append("radMode", data.radMode);
      // form.append("type", "filter");

      // var responce = await userService.FreeQuestion(form);

      // if (responce.data.error) {
      //   toast.error(responce.data.error);
      // } else {
      //   // console.log(responce.data, "jghjgjg");
      //   // console.log(responce.data.question_ids, "jghjgjg");

      //   let new_ans = await removeDuplicates(responce.data.ques.ans);

      //   responce.data.ques.ans = new_ans;



      //   dispatch(questionActions.questionReset());

      //   dispatch(questionActions.questionlist(responce.data.ques));
      //   dispatch(questionActions.questionid(responce.data.question_ids));
      //   dispatch(questionActions.totalQuestion(responce.data.question_count));
      //   dispatch(questionActions.subject_name(responce.data.subject_name));
      //   dispatch(questionActions.radMode(data.radMode));
      //   dispatch(
      //     questionActions.speedRefFileLink(
      //       responce.data.speed_reference_file_path
      //     )
      //   );

      //   dispatch(questionActions.subject_id(data.lstSubject));
      //   dispatch(questionActions.flag_type(responce.data.flag_type));

      //   dispatch(
      //     questionActions.passing_percentage(
      //       Number(responce.data.passing_percentage)
      //     )
      //   );

      //   Navigate("/free-exam");
      // }
    } else {


      const form = new FormData();
      form.append("lstSubject", data.lstSubject);
      form.append("lstNum", data.lstNum);
      form.append("chkRandom", checkRandom);
      form.append("chkHide", checkH);
      form.append("radMode", data.radMode);
      form.append("type", "filter");
      form.append("userId", auth.user_id);

      var responce = await userService.Postquestion(form);

      // console.log(responce.data);
      if (responce.data.error) {
        toast.error(responce.data.error);
        setModalmsg("You do not have a valid plan to load");
        handleShow();

      } else {
        // console.log(responce.data, "jghjgjg");
        // console.log(responce.data.question_ids, "jghjgjg");

        let new_ans = await removeDuplicates(responce.data.ques.ans);

        responce.data.ques.ans = new_ans;

        dispatch(questionActions.questionReset());
        dispatch(questionActions.questionlist(responce.data.ques));
        dispatch(questionActions.questionid(responce.data.question_ids));
        dispatch(questionActions.totalQuestion(responce.data.question_count));
        dispatch(questionActions.subject_name(responce.data.subject_name));
        dispatch(questionActions.radMode(data.radMode));
        dispatch(
          questionActions.speedRefFileLink(
            responce.data.speed_reference_file_path
          )
        );

        dispatch(questionActions.subject_id(data.lstSubject));
        dispatch(questionActions.flag_type(responce.data.flag_type));

        dispatch(
          questionActions.passing_percentage(
            Number(responce.data.passing_percentage)
          )
        );

        Navigate("/exam");
      }
    }
  };

  // ============ mobile view submit form =================
  var mobileViewSubmit = async () => {
    //alert("ok");
    // if (!auth.isAuthenticated) {
    //     toast.warning("Login Is Required!")
    //     return;
    // }

    // alert(1)

    if (selectedId == "") {
      setlstSubjectError(true);
    } else {
      setlstSubjectError(false);
    }

    if (lstNum[currentStepIndex] < 5 && auth.isAuthenticated == false) {
      setlstlstNumError(true);
    } else {
      setlstlstNumError(false);
    }

    if (selectedVal == "" || (lstNum < 5 && auth.isAuthenticated == false)) {
      return;
    }

    var data = {
      lstSubject: selectedId,
      lstNum: lstNum[currentStepIndex],
      chkRandom: switchrandom,
      chkHide: switchclear,
      radMode: Switchexammode,
    };

    // console.log("mobile view data ", data);

    // return;

    let chkRandom = data.chkRandom;
    let chkHide = data.chkHide;
    if (chkRandom) {
      var checkRandom = "0";
    } else {
      var checkRandom = "1";
    }
    if (chkHide) {
      var checkH = "0";
    } else {
      var checkH = "1";
    }
    setAlldataform(data)
    if (!auth.isAuthenticated) {
      setModalmsg("You're NOT logged in to any account.");
      handleShow();
      // const form = new FormData();

      // form.append("lstSubject", data.lstSubject);
      // form.append("lstNum", data.lstNum);
      // form.append("chkRandom", checkRandom);
      // form.append("chkHide", checkH);
      // form.append("radMode", data.radMode);
      // form.append("type", "filter");

      // var responce = await userService.FreeQuestion(form);

      // if (responce.data.error) {
      //   toast.error(responce.data.error);
      // } else {
      //   // console.log(responce.data, "jghjgjg");
      //   // console.log(responce.data.question_ids, "jghjgjg");

      //   let new_ans = await removeDuplicates(responce.data.ques.ans);

      //   responce.data.ques.ans = new_ans;


      //   dispatch(questionActions.questionReset());

      //   dispatch(questionActions.questionlist(responce.data.ques));
      //   dispatch(questionActions.questionid(responce.data.question_ids));
      //   dispatch(questionActions.totalQuestion(responce.data.question_count));
      //   dispatch(questionActions.subject_name(responce.data.subject_name));
      //   dispatch(questionActions.radMode(data.radMode));
      //   dispatch(
      //     questionActions.speedRefFileLink(
      //       responce.data.speed_reference_file_path
      //     )
      //   );

      //   dispatch(questionActions.subject_id(data.lstSubject));
      //   dispatch(questionActions.flag_type(responce.data.flag_type));

      //   dispatch(
      //     questionActions.passing_percentage(
      //       Number(responce.data.passing_percentage)
      //     )
      //   );

      //   Navigate("/free-exam");
      // }
    } else {
      const form = new FormData();
      form.append("lstSubject", data.lstSubject);
      form.append("lstNum", data.lstNum);
      form.append("chkRandom", checkRandom);
      form.append("chkHide", checkH);
      form.append("radMode", data.radMode);
      form.append("type", "filter");
      form.append("userId", auth.user_id);

      var responce = await userService.Postquestion(form);

      // console.log(responce.data);
      if (responce.data.error) {
        setModalmsg("You're NOT subscribed to select Module.");
        toast.error(responce.data.error);
        handleShow();
      } else {
        // console.log(responce.data, "jghjgjg");
        // console.log(responce.data.question_ids, "jghjgjg");

        let new_ans = await removeDuplicates(responce.data.ques.ans);

        responce.data.ques.ans = new_ans;

        // sessionStorage.clear();

        // dispatch({ type: "questionlist", value: responce.data.ques });

        // const arrayOfObjects = Object.keys(responce.data.question_ids).map((key) => ({ key, value: responce.data.question_ids[key] }));

        // dispatch({ type: "questionid", value: responce.data.question_ids });
        // dispatch({ type: "totalQuestion", value: data.lstNum });
        // dispatch({ type: "subject_name", value: responce.data.subject_name });
        // dispatch({ type: "radMode", value: data.radMode });

        dispatch(questionActions.questionReset());

        dispatch(questionActions.questionlist(responce.data.ques));
        dispatch(questionActions.questionid(responce.data.question_ids));
        dispatch(questionActions.totalQuestion(responce.data.question_count));
        dispatch(questionActions.subject_name(responce.data.subject_name));
        dispatch(questionActions.radMode(data.radMode));
        dispatch(
          questionActions.speedRefFileLink(
            responce.data.speed_reference_file_path
          )
        );

        dispatch(questionActions.subject_id(data.lstSubject));
        dispatch(questionActions.flag_type(responce.data.flag_type));

        dispatch(
          questionActions.passing_percentage(
            Number(responce.data.passing_percentage)
          )
        );

        Navigate("/exam");
      }
    }
  };

  //   // console.log(user_info,'user_info')

  var getdropdowndata = async () => {
    let mem_id = auth.user_id;
    // console.log(auth.user_id);
    if (mem_id !== "") {
      let datas = {
        mem_id: mem_id,
        engine_type: "filter",
      };
      var response = await userService.getlist(datas);
      // console.log("faqdata ", response.data);

      // console.log(mem_id);
      if (response.data.error) {
        setDropdowndata([]);
      } else {
        var arr = [];
        var mobile_arr = [];
        // console.log(response.data.length);
        for (let i = 0; i < response.data.length; i++) {
          var itemdata = response.data[i];
          for (let i = 0; i < itemdata.length; i++) {
            let dataitem = itemdata[i];
            arr.push(dataitem);
            // mobile_arr.push({
            //   id: dataitem.option_value,
            //   value: dataitem.option,
            // });
            // console.log(dataitem, "dataitem");
          }
          // console.log(itemdata, "aarayadata");
        }
        // setDropdowndata(response.data)
        // // console.log(response.data, 'responsedata123')

        setDropdowndata(arr);


      }
    } else {
      // console.log("not get token");
    }

    reset();
  };
  var getFreeTrialDropdownData = async () => {

    var response = await userService.get_free_trial_dropdown_data();
    //  // console.log("free trial data ", response.data);


    if (response.data.error) {
      setDropdowndata([]);
    } else {
      var arr = [];
      var mobile_arr = [];
      // console.log("free trial data",response.data.dropdown_data);


      var drp_data = response.data.dropdown_data;
      if (auth.isAuthenticated) {
        drp_data.unshift({ option_value: "[FAQ]", option: "Orientation" }, { option_value: "[BQ]", option: "Bookmarked" });
      }
      // }else{
      //   drp_data.unshift({option_value:"[FAQ]",option:"Orientation"});
      // }
      setDropdowndata(drp_data);


    }

    reset();
  };
  var getnewdropdowndata = async () => {

    let datas = {
      userId: auth.user_id,

    };
    var response = await userService.get_new_dropdown_data(datas);
    //  // console.log("free trial data ", response.data);


    if (response.data.error) {
      setDropdowndata([]);
    } else {
      var arr = [];
      var mobile_arr = [];
      // console.log("new drop down data",response.data.dropdown_data);


      var drp_data = response.data.dropdown_data;
      if (auth.isAuthenticated) {
        drp_data.unshift({ option_value: "[FAQ]", option: "Orientation" }, { option_value: "[BQ]", option: "Bookmarked" });
      }
      // }else{
      //   drp_data.unshift({option_value:"[FAQ]",option:"Orientation"});
      // }
      setDropdowndata(drp_data);


    }

    reset();
  };
  var getmobiledropdowndata = async () => {
    let datas = {
      userId: auth.user_id,

    };
    var response = await userService.getmobiledatalist(datas);
    // console.log("mobile data response ", response.data.dropdown_data);
    if (response.data.status) {
      var drp_data = response.data.dropdown_data;
      if (auth.isAuthenticated) {

        drp_data.unshift({ id: "[FAQ]", value: "Orientation" }, { id: "[BQ]", value: "Bookmarked" });
        setMobileDropdowndata(drp_data);
      } else {
        //drp_data.unshift({option_value:"[FAQ]",option:"Orientation"});
        setMobileDropdowndata(drp_data);

      }
    }


    reset();
  };


  // console.log(auth, "!auth.isAuthenticated");


  const toggleDisplayExam = () => {
    // alert(auth.isAuthenticated)
    if (auth.isAuthenticated) {
      if (Switchexammode === 1) {
        setSwitchexammode(2);
      } else {
        setSwitchexammode(1);
        // console.log(Switchexammode);
      }
    } else {
      toast.warning("With out login exam mode not active!");
    }
  };

  const toggleDisplayRandom = () => {
    if (switchrandom == 0) {
      // alert(1)
      setSwitchrandom(1);
      // console.log(switchrandom);
    } else {
      // alert(2);
      setSwitchrandom(0);
      // console.log(switchrandom);
    }
  };

  const toggleDisplayClear = () => {
    if (switchclear === 0) {
      setSwitchclear(1);
    } else {
      setSwitchclear(0);
      // console.log(switchclear);
    }
  };
  const getchapterbymodule = async (e) => {
    //alert("ok");
    // console.log(e.target.value,"aglkdfj dflgldf")
    var module_id = e.target.value;

    if (module_id == "[BQ]" || module_id == "[FAQ]") {
      setValue("lstSubject", module_id);
      setShowchapter(false)

    } else {
      setShowchapter(true)
      setSelectedModule(e.target.value)
      let datas = {
        module_id: e.target.value,

      };

      var response = await userService.getchapterbymodule(datas);
      // console.log("module chapter data response ", response.data.dropdown_data);
      if (response.data.status) {
        var drp_data = response.data.dropdown_data;
        setChapterDropdowndata(drp_data)
      }

    }



  }
  const setchaptername = (e) => {
    setSelectedChapter(e.target.options[e.target.selectedIndex].text);
    //var index = e.target.selectedIndex;

    // console.log(e.target.options[e.target.selectedIndex].text,"cghv");

  }
  const NLogout = () => {


    dispatch(authActions.Logout());
    window.location.replace('https://www.cmfas.com.sg/cmfas_logout.php')
  };


  const handleInputChange = (e) => {
    // alert(1)
    setCurrentStepIndex(Number(e.currentTarget.value));

    // const range = document.getElementById("custom_range"); // Use getElementById for simplicity
    const bubble = document.getElementById("custom_bubble");
    // const val = range.value;
    // const min = range.min ? range.min : 0;
    // const max = range.max ? range.max : 100;
    const val = lstNum[Number(e.currentTarget.value)];
    const min = auth.isAuthenticated ? 10 : 0;
    const max = auth.isAuthenticated ? 100 : 0;
    const newVal = Number(((val - min) * 100) / (max - min));
    // alert(newVal);
    bubble.innerHTML = val;
    // Sorta magic numbers based on size of the native UI thumb
    bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
  };

  const customRangeValuePreSet = () => {
    // const range = document.getElementById("custom_range"); // Use getElementById for simplicity
    const bubble = document.getElementById("custom_bubble");
    // const val = range.value;
    // const min = range.min ? range.min : 0;
    // const max = range.max ? range.max : 100;
    const val = auth.isAuthenticated ? 10 : 5;
    const min = auth.isAuthenticated ? 10 : 0;
    const max = auth.isAuthenticated ? 100 : 0;
    const newVal = Number(((val - min) * 100) / (max - min));
    // alert(newVal);
    bubble.innerHTML = val;
    // Sorta magic numbers based on size of the native UI thumb
    bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
    // bubble.style.left = `calc(0% + 8px))`;
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      //getdropdowndata();
      customRangeValuePreSet()
    } else {
      //getFreeTrialDropdownData();
      customRangeValuePreSet()
    }
    getnewdropdowndata();
    getmobiledropdowndata();
    // setDropdowndatavalue(itemdata)
    document.body.classList.remove("bg-salmon");

    if (auth.isAuthenticated) {
      setMminstep(10);
      setMmaxstep(100);
      setSelectedVal('');
      setSelectedId('');
      setLstNum([10, 25, 45, 50, 60, 75, 80, 100]);
      setSwitchrandom(0);
      setSwitchclear(0);
      setSwitchexammode(1);
      setlstSubjectError(false);
      setlstlstNumError(false);
    } else {
      setMminstep(1);
      setMmaxstep(5);
      setSelectedVal('');
      setSelectedId('');
      setLstNum([5]);
      setSwitchrandom(0);
      setSwitchclear(0);
      setSwitchexammode(1);
      setlstSubjectError(false);
      setlstlstNumError(false);
    }

  }, [auth.isAuthenticated]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.clear();
    }
  }, []);




  return (
    <>
      <section className="text-engine d_mode">
        <div className="container">
          <div className="text-engine-content ">
            <div className="top-login-wrap">
              <div className="logo mb-2">
                <a href="https://www.cmfas.com.sg/">
                  <img src={logo} alt="logo" className="footer-logo" />
                </a>
              </div>
              {auth.isAuthenticated ? (
                <div className="top-login">
                  <a
                    className="login"
                    href="javascript:void(0)"
                    onClick={NLogout}
                  // onClick={loginPageModalShow}
                  >
                    Logout
                  </a>
                </div>

              ) : (
                <div className="top-login">
                  <a
                    className="login"
                    href="javascript:void(0)"
                    data-bs-toggle="modal"
                    data-bs-target="#loginpopup"
                  // onClick={loginPageModalShow}
                  >
                    Login
                  </a>
                </div>

              )}
            </div>

            <form
              className="row g-3 text-engine-frm"
              onSubmit={handleSubmit(submit)}
            >
              <div className="col-md-8">
                <label htmlFor="inputState1" className="form-label">
                  Pick A Question Set:
                </label>


                <select
                  id="inputState1"
                  className="form-select"
                  {...register("lstModule")}
                  onChange={getchapterbymodule}
                >
                  <option Value={""}>Choose a Module First</option>

                  {Dropdowndata &&
                    Dropdowndata.map((item) => {
                      return (
                        <option value={item.option_value}  >
                          {item.option}
                        </option>
                      );
                    })}
                </select>

                <label htmlFor="inputState3" className="form-label">

                </label>

                {showchapter ? (

                  <select
                    id="inputState3"
                    className="form-select"
                    {...register("lstSubject")}
                    onChange={setchaptername}
                  >
                    <option Value={""}>Choose a Filter below</option>

                    {ChapterDropdowndata &&
                      ChapterDropdowndata.map((item) => {
                        return (
                          <option value={item.option_value}>
                            {item.option}
                          </option>
                        );
                      })}
                  </select>

                ) : null}




                {/* <MobileSelector
            MobileDropdowndata={MobileDropdowndata}
            setValue={setValue}
            setSelectedVal={setSelectedVal}
            selectedVal={selectedVal}
          
            setSelectedCourseVal={setSelectedCourseVal}
            selectedCourseVal={selectedCourseVal}
            setSelectedId={setSelectedId}
          /> */}
                <p style={{ color: "red" }} className="form-field-error">
                  {errors.lstSubject?.message}
                </p>
              </div>
              {/* ============= no  of question ========= */}
              <div className="col-md-8 ">
                <label htmlFor="inputState" className="form-label">
                  Max Questions to Load:
                </label>
                <a style={{ marginLeft: 5 }}
                  data-tooltip-id="my-question"
                  data-tooltip-content="We discourage doing massive questions in one session."
                >
                  ⓘ
                </a>
                <Tooltip id="my-question" />
                <select
                  id="inputState2"
                  className="form-select"
                  {...register("lstNum")}
                >
                  <option selected="" value={10}>
                    10 Questions
                  </option>
                  <option value={25}>25 Questions</option>
                  <option value={40}>40 Questions</option>
                  <option value={50}>50 Questions</option>
                  <option value={60}>60 Questions</option>
                  <option value={75}>75 Questions</option>
                  <option value={80}>80 Questions</option>
                  <option value={100}>100 Questions</option>
                  <option value={200}>200 Questions</option>
                </select>

                <p style={{ color: "red" }} className="form-field-error">
                  {errors.lstNum?.message}
                </p>
              </div>

              {/* =================== end ======================  */}
              <div className="check-wrap">
                <ul>
                  <li>
                    <input
                      type="checkbox"

                      {...register("chkRandom")}
                    />
                    <label htmlFor="">Sequential</label>
                    <a
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="Keep this unticked for questions to be fetched randomly."
                    >
                      ⓘ
                    </a>
                    <Tooltip id="my-tooltip" />

                    <p style={{ color: "red" }} className="form-field-error">
                      {errors.chkRandom?.message}
                    </p>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      {...register("chkHide")}
                    />
                    <label htmlFor="">Redo Cleared Questions</label>
                    <a
                      data-tooltip-id="my-skip"
                      data-tooltip-content="Tick this to fetch questions that have been answered correctly before."
                    >
                      ⓘ
                    </a>
                    <Tooltip id="my-skip" />
                    <p style={{ color: "red" }} className="form-field-error">
                      {errors.chkHide?.message}
                    </p>
                  </li>
                </ul>
              </div>
              <div className="mode-of-exam">
                <h5>Mode Of Exam:</h5>
                <div className="mode-of-exam-wrap subscription-container select-theme-wrap">
                  {/* <input type="radio" name="theme_id" id="card_one" value={1} defaultChecked {...register('radMode')} />
                                    <label htmlFor="card_one" className="card_one">
                                        <p style={{ color: 'red' }} className='form-field-error'>{errors.radMode?.message}</p>
                                        <div className="m-exam-l card">
                                            <span className="check_btn" />
                                            <img src={learnig} alt="learning" />
                                            <span>Learning Mode</span>
                                        </div>
                                    </label>
                                    <input
                                        type="radio"
                                        name="theme_id"
                                        id="card_two"
                                        value={2}
                                        defaultChecked=""
                                        {...register('radMode')}
                                    />
                                    <label htmlFor="card_two" className="card_two">
                                        <p style={{ color: 'red' }} className='form-field-error'>{errors.radMode?.message}</p>
                                        <div className="m-exam-l card">
                                            <span className="check_btn" />
                                            <img src={exam} alt="exam-mode" />
                                            <span>Exam Mode</span>
                                        </div>
                                    </label> */}
                  <ul>
                    <li>
                      <p id="t_test1">
                        <input
                          type="radio"
                          id="answer1"
                          name="answer"
                          value={1}
                          checked
                          {...register("radMode")}
                        />
                        <label for="answer1">
                          <span>Learning Mode</span>
                        </label>{" "}
                        <a
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content="Upon answering, answer will be marked instantly and explanation will appear"
                        >
                          ⓘ
                        </a>
                      </p>
                    </li>

                    <li>
                      <p id="t_test2">
                        <input
                          type="radio"
                          id="answer2"
                          name="answer"
                          value={2}
                          {...register("radMode")}
                        />
                        <label for="answer2">
                          <span>Exam Mode</span>
                        </label>{" "}
                        <a
                          data-tooltip-id="my-skip"
                          data-tooltip-content="Simulated exam mode. No instant marking, no showing of explanation. Score will be shown at the end"
                        >
                          ⓘ
                        </a>
                      </p>
                    </li>

                  </ul>
                </div>
                <button type="submit" className="enter animate-btn">
                  Start Session
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ========= mobile-filter-Start======= */}
      <div className="cmf-mb-filter">
        <label for="">Choose a Module and Filter:</label>
        <div className="cmf-mb-filter-t-wrap">
          <MobileSelector
            MobileDropdowndata={MobileDropdowndata}
            setValue={setValue}
            setSelectedVal={setSelectedVal}
            selectedVal={selectedVal}

            setSelectedCourseVal={setSelectedCourseVal}
            selectedCourseVal={selectedCourseVal}
            setSelectedId={setSelectedId}
          />
        </div>

        <p
          style={{ color: "red", fontSize: "16px" }}
          className="form-field-error"
        >
          {lstSubjectError && <>please select subject</>}
        </p>

        {/* =-=-Range-start=-=-=- */}

        <div className="cmf-mb-filter-range">
          <label htmlFor="">Max. Questions to Load: <i
            data-tooltip-id="m-my-question"
            data-tooltip-content="We discourage doing massive questions in one session."
            class="fa-regular fa-circle-question nquestion"
          ></i>
            <Tooltip id="m-my-question" /></label>

          <div className="range-wrap">
            <input
              type="range"
              className="custom_range"
              id="custom_range"
              onInput={handleInputChange}
              step="1"
              min="0"
              max={auth.isAuthenticated ? "7" : "0"}
              value={currentStepIndex}
            />
            <output
              className="custom_bubble"
              id="custom_bubble"
            // style={{ left: "calc(0% + 8px)" }}
            ></output>
          </div>


          {/* <Range
            step={mstep}
            min={mminstep}
            max={mmaxstep}
            values={lstNum}
            // onChange={(value) => setLstNum(value)}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: "4px",
                  width: "100%",
                  backgroundColor: "#D4D4D2",
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: "20px",
                  width: "20px",
                  backgroundColor: "#1e88e5",
                  borderRadius: "50%",
                  color: "#fff",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  outline: "0",
                }}
              >
                {lstNum[currentStepIndex]}
              </div>
            )}
          /> */}



          <p
            style={{ color: "red", fontSize: "16px" }}
            className="form-field-error"
          >
            {lstlstNumError && (
              <>number of question not less than 5</>
            )}
          </p>

          <div className="mobile-range-btm-wrap">
            <div className="f-wrap">
              <span className="text">Redo Cleared Questions</span>

              <div className="switch-toggle">
                <i
                  data-tooltip-id="m-my-skip"
                  data-tooltip-content="Tick this to fetch questions that have been answered correctly before."
                  class="fa-regular fa-circle-question"
                ></i>
                <Tooltip id="m-my-skip" />
                <label class="switch">
                  <input
                    type="checkbox"
                    onClick={toggleDisplayClear}
                    checked={switchclear == 1 ? true : false}
                  />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            <div className="f-wrap">
              <span className="text">Sequential</span>

              <div className="switch-toggle">
                <i
                  data-tooltip-id="m-my-tooltip"
                  data-tooltip-content="Keep this unticked for questions to be fetched randomly."
                  class="fa-regular fa-circle-question"
                ></i>

                <Tooltip id="m-my-tooltip" />
                <label class="switch">
                  <input
                    type="checkbox"
                    onClick={toggleDisplayRandom}
                    checked={switchrandom == 1 ? true : false}
                  />
                  <span class="slider"></span>
                </label>
              </div>
            </div>

            <div className="f-wrap">
              <span className="text">Exam Mode</span>

              <div className="switch-toggle">
                <i data-tooltip-id="m-exam-tooltip"
                  data-tooltip-content="Simulated exam mode. No instant marking, no showing of explanation. Score will be shown at the end" class="fa-regular fa-circle-question"></i>
                <Tooltip id="m-exam-tooltip" />
                <label class="switch">
                  <input
                    type="checkbox"
                    onClick={toggleDisplayExam}
                    checked={Switchexammode == 1 ? false : true}
                  />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            <button type="button" onClick={mobileViewSubmit}>
              Start Session
            </button>
          </div>
        </div>
        {/* =-=-Range-end=-=-=- */}
      </div>
      {/* ========= mobile-filter-End======= */}

      {/* <LoginPage /> */}
      {/* <section className="model-login-popup">
                <div
                    className="modal fade"
                    id="loginpopup"
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
                            <div className="modal-content-wrap">
                                <div className="model-left">
                                    <img src={leftbanner} alt="mdl-img" />
                                </div>
                                <div className="model-right">
                                    <h4>Sign In</h4>
                                    <form className="row g-4" onSubmit={handleSubmit(submit)}>
                                        <div className="col-md-12">
                                            <label htmlFor="">E-Mail Address</label>
                                            <input type="email"  {...register('email')} />
                                            <p style={{ color: 'red' }} className='form-field-error'>{errors.email?.message}</p>
                                        </div>
                                        <div className="col-md-12">
                                            <label htmlFor="">Password</label>
                                            <input type="password" {...register('password')} />
                                            <p style={{ color: 'red' }} className='form-field-error'>{errors.password?.message}</p>
                                        </div>
                                        <div className="col-md-12 my-5">
                                            <button className="sign-in " type="submit">Sign in</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
      <Modal show={show} onHide={handleClose} className="sub-mdl">
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="logo mb-2">
              <NavLink to="/">
                <img src={logo} alt="logo" className="footer-logo" />
              </NavLink>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div>

            <span>
              {modalmsg}
            </span>
            {auth.isAuthenticated &&
              <>
                <span style={{ marginLeft: 5 }}>
                  {selectedModule}
                </span>
                <span>( {selectedChapter} )
                </span>
              </>
            }


          </div>
          <div>
            We will load 5 free trial Qs
          </div>
          <div>

          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose} className="cancel-btn">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFreeTrial} className="ok-btn">
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showtermcondition} onHide={termconditionhandleClose} className="license-agree-modal">
        <Modal.Header closeButton>
          <Modal.Title>END USER LICENSE AGREEEMENT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            align="left"
            style={{
              padding: 15,
              overflow: "auto",
              fontSize: "11pt",
              textAlign: "justify",
              fontFamily: "Open Sans"
            }}
          >
            <b>Instruction:</b> Read through this and scroll down to the bottom to Agree
            or Disagree.
            <br />
            <br />
            Upon purchase or registration of any Product from CMFAS Academy (a brand
            managed by KLOGE LLP), the account owner is granted the right to use ONE copy
            of the software, subscription or study guide product, for a SINGLE user, for
            private and non-commercial use. Access to any content provided on a
            subscription basis is permitted solely to the registered User. It is the
            responsibility of the User to protect the confidentiality of access
            credentials such as login User identification and password. The registered
            User identification (email) and password may NOT be shared with other users.
            <br />
            <br />
            You acknowledge the copyright of all Products are authorised to KLOGE LLP, is
            protected by Singapore copyright laws and international treaty provisions, and
            will not challenge KLOGE LLP's Copyright authority for said Product(s).
            Content within the Product(s) (examples include but are not limited to:
            Practice Test Software, Study Guide, Web-Based Training, or other provided
            resource materials) may be managed by or authorised to KLOGE LLP and/or an
            Independent Contractor Author or Publisher, and is protected by Singapore
            copyright laws and international treaty provisions.
            <br />
            <br />
            <strong>You may NOT copy</strong> any registered Product, software, test
            question, study guide, or related document, to any other computer.{" "}
            <strong>
              You may NOT share course subscription access credentials such as user name
              and password with any other user.
            </strong>{" "}
            You may NOT permit the public viewing or use of any Product (i.e. software,
            E-Learning or study guide).
            <br />
            <br />
            <strong>
              You agree to pay for one additional subscription license for each unique
              device fingerprint recorded by our system should it be found that your
              account had been accessed by a third party other than you.
            </strong>
            <br />
            <br />
            All access to our material without a valid license, or using someone else's
            license, regardless with or without permission from the account owner, is
            prohibited. You agree to pay damages for all use of the software without
            license, including but not limited to the cost of overused licenses, late
            payment fees, legal fees, court fees and investigation fees.
            <br />
            <br />
            Any type of copying of any Product, software, or product content is prohibited
            by Copyright Law and/or International Treaties. All Products (eg. software,
            practice tests, and web-based training) are licensed to the individual or
            entity (user as defined in this EULA) on a per-user basis. The user agrees
            with the terms of all sections of this agreement.
            <br />
            <br />
            No warranty is expressed or implied. All information provided by contractors
            or staff of KLOGE LLP, or within Content (such as test questions, practice
            tests, databases, web-based training, etcetera), software, Products, and all
            related information is provided on an 'as-is' basis with no warranty or
            fitness implied. The user agrees that the various Independent Contractor
            Authors, Publishers, KLOGE LLP Staff, and KLOGE LLP shall have neither
            liability nor responsibility to any person or entity with respect to any loss
            or damages arising from the Product, or any information contained on the KLOGE
            LLP Web Site or from the use of any KLOGE LLP related information, software,
            or training programs.
            <br />
            <br />
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={termconditionhandleClose}>
            I DISAGREE
          </Button>
          <Button variant="primary" onClick={handleExam}>
            I AGREEE
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Home;
