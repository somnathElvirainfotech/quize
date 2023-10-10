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
function Home() {
  // const { user, dispatch } = useContext(userContext);
  const tirggerRef = useRef(null);

  let msInstance = null;
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [Dropdowndata, setDropdowndata] = useState([]);
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
  //  =========== end mobile view state =================

  // const [Dropdowndatavalue, setDropdowndatavalue] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(QuestionSchama),
  });

  var Navigate = useNavigate();

  // ============ desktop view submit form =================
  var submit = async (data) => {
    //alert("ok");
    // if (!auth.isAuthenticated) {
    //     toast.warning("Login Is Required!")
    //     return;
    // }

    // alert(1)
    console.log(data);
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

    if (!auth.isAuthenticated) {
      const form = new FormData();
      form.append("lstSubject", data.lstSubject);
      form.append("lstNum", data.lstNum);
      form.append("chkRandom", checkRandom);
      form.append("chkHide", checkH);
      form.append("radMode", data.radMode);
      form.append("type", "filter");

      var responce = await userService.FreeQuestion(form);

      if (responce.data.error) {
        toast.error(responce.data.error);
      } else {
        console.log(responce.data, "jghjgjg");
        console.log(responce.data.question_ids, "jghjgjg");

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

      console.log(responce.data);
      if (responce.data.error) {
        toast.error(responce.data.error);
      } else {
        console.log(responce.data, "jghjgjg");
        console.log(responce.data.question_ids, "jghjgjg");

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

    if (lstNum[0] < 5 && auth.isAuthenticated == false) {
      setlstlstNumError(true);
    } else {
      setlstlstNumError(false);
    }

    if(selectedVal == "" || (lstNum < 5 && auth.isAuthenticated == false)){
      return;
    }

    var data = {
      lstSubject: selectedId,
      lstNum: lstNum[0],
      chkRandom: switchrandom,
      chkHide: switchclear,
      radMode: Switchexammode,
    };

    console.log("mobile view data ", data);

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

    if (!auth.isAuthenticated) {
      const form = new FormData();
      
      form.append("lstSubject", data.lstSubject);
      form.append("lstNum", data.lstNum);
      form.append("chkRandom", checkRandom);
      form.append("chkHide", checkH);
      form.append("radMode", data.radMode);
      form.append("type", "filter");

      var responce = await userService.FreeQuestion(form);

      if (responce.data.error) {
        toast.error(responce.data.error);
      } else {
        console.log(responce.data, "jghjgjg");
        console.log(responce.data.question_ids, "jghjgjg");

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

        Navigate("/free-exam");
      }
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

      console.log(responce.data);
      if (responce.data.error) {
        toast.error(responce.data.error);
      } else {
        console.log(responce.data, "jghjgjg");
        console.log(responce.data.question_ids, "jghjgjg");

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

  //   console.log(user_info,'user_info')

  var getdropdowndata = async () => {
    let mem_id = auth.user_id;
    console.log(auth.user_id);
    if (mem_id !== "") {
      let datas = {
        mem_id: mem_id,
        engine_type: "filter",
      };
      var response = await userService.getlist(datas);
      console.log("faqdata ", response.data);

      console.log(mem_id);
      if (response.data.error) {
        setDropdowndata([]);
      } else {
        var arr = [];
        var mobile_arr = [];
        console.log(response.data.length);
        for (let i = 0; i < response.data.length; i++) {
          var itemdata = response.data[i];
          for (let i = 0; i < itemdata.length; i++) {
            let dataitem = itemdata[i];
            arr.push(dataitem);
            // mobile_arr.push({
            //   id: dataitem.option_value,
            //   value: dataitem.option,
            // });
            console.log(dataitem, "dataitem");
          }
          console.log(itemdata, "aarayadata");
        }
        // setDropdowndata(response.data)
        // console.log(response.data, 'responsedata123')
        
        setDropdowndata(arr);

       
      }
    } else {
      console.log("not get token");
    }

    reset();
  };
  var getFreeTrialDropdownData = async () => {
  
      var response = await userService.get_free_trial_dropdown_data();
    //  console.log("free trial data ", response.data);

     
      if (response.data.error) {
        setDropdowndata([]);
      } else {
        var arr = [];
        var mobile_arr = [];
        console.log("free trial data",response.data.dropdown_data);
       
       
        var drp_data=response.data.dropdown_data;
        if (auth.isAuthenticated) {
          drp_data.unshift({option_value:"[FAQ]",option:"Orientation"},{option_value:"[BQ]",option:"Bookmarked"});
        }else{
          drp_data.unshift({option_value:"[FAQ]",option:"Orientation"});
        }
        setDropdowndata(drp_data);

       
      }
    
    reset();
  };
  var getmobiledropdowndata = async () => {
   
      var response = await userService.getmobiledatalist();
      console.log("mobile data response ", response.data.dropdown_data);
      if (response.data.status) {
        var drp_data=response.data.dropdown_data;
        if (auth.isAuthenticated) {
          
          drp_data.unshift({id:"[FAQ]",value:"Orientation"},{id:"[BQ]",value:"Bookmarked"});
          setMobileDropdowndata(drp_data);
        } else {
          drp_data.unshift({option_value:"[FAQ]",option:"Orientation"});
          setMobileDropdowndata(drp_data);
          
        }
      } 
   

    reset();
  };
  

  console.log(auth, "!auth.isAuthenticated");


  const toggleDisplayExam = () => {
    // alert(auth.isAuthenticated)
    if (auth.isAuthenticated) {
      if (Switchexammode === 1) {
        setSwitchexammode(2);
      } else {
        setSwitchexammode(1);
        console.log(Switchexammode);
      }
    } else {
      toast.warning("With out login exam mode not active!");
    }
  };

  const toggleDisplayRandom = () => {
    if (switchrandom == 0) {
      // alert(1)
      setSwitchrandom(1);
      console.log(switchrandom);
    } else {
      // alert(2);
      setSwitchrandom(0);
      console.log(switchrandom);
    }
  };

  const toggleDisplayClear = () => {
    if (switchclear === 0) {
      setSwitchclear(1);
    } else {
      setSwitchclear(0);
      console.log(switchclear);
    }
  };


  useEffect(() => {
    if(auth.isAuthenticated){
    getdropdowndata();
    }else{
      getFreeTrialDropdownData();
    }
    getmobiledropdowndata();
    // setDropdowndatavalue(itemdata)
    document.body.classList.remove("bg-salmon");

    if(auth.isAuthenticated){
      setMminstep(10);
      setMmaxstep(100);
      setSelectedVal('');
      setSelectedId('');
      setLstNum([10]);
      setSwitchrandom(0);
      setSwitchclear(0);
      setSwitchexammode(1);
      setlstSubjectError(false);
      setlstlstNumError(false);
    }else{
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

  return (
    <>
      <section className="text-engine d_mode">
        <div className="container">
          <div className="text-engine-content ">
            <h2>Filter-Based Test Engine</h2>
            <form
              className="row g-3 text-engine-frm"
              onSubmit={handleSubmit(submit)}
            >
              <div className="col-md-6">
                <label htmlFor="inputState" className="form-label">
                  Pick A Question Set:
                </label>
                {!auth.isAuthenticated && (
                  <select
                    id="inputState"
                    className="form-select"
                    {...register("lstSubject")}
                  >
                   <option Value={""}>Choose a Filter below</option>

                    {Dropdowndata &&
                      Dropdowndata.map((item) => {
                        return (
                          <option value={item.option_value}>
                            {item.option}
                          </option>
                        );
                      })}
                  </select>
                )}
                {auth.isAuthenticated && (
                  <select
                    id="inputState"
                    className="form-select"
                    {...register("lstSubject")}
                  >
                    <option Value={""}>Choose a Filter below</option>

                    {Dropdowndata &&
                      Dropdowndata.map((item) => {
                        return (
                          <option value={item.option_value}>
                            {item.option}
                          </option>
                        );
                      })}
                  </select>
                )}
                <p style={{ color: "red" }} className="form-field-error">
                  {errors.lstSubject?.message}
                </p>
              </div>
              {/* ============= no  of question ========= */}
              <div className="col-md-6 ">
                <label htmlFor="inputState" className="form-label">
                  How Many Questions To Load?
                </label>
                {!auth.isAuthenticated && (
                  <select
                    id="inputState"
                    className="form-select"
                    {...register("lstNum")}
                  >
                    <option selected="" value={5}>
                      5 Questions
                    </option>
                  </select>
                )}
                {auth.isAuthenticated && (
                  <select
                    id="inputState"
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
                )}
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
                      data-tooltip-content="Questions will be sorted randomly"
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
                      data-tooltip-content="Fetch only questions that had not ever been answered correctly before"
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
                    {auth.isAuthenticated && (
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
                    )}
                  </ul>
                </div>
                <button type="submit" className="enter animate-btn">
                  Submit
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
          <label htmlFor="">Max. Questions to Load:</label>
          <Range
            step={mstep}
            min={mminstep}
            max={mmaxstep}
            values={lstNum}
            onChange={(value) => setLstNum(value)}
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
                {lstNum[0]}
              </div>
            )}
          />

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
                  data-tooltip-content="Fetch only questions that had not ever been answered correctly before"
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
                  data-tooltip-content="Questions will be sorted randomly"
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
                <i class="fa-regular fa-circle-question"></i>
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
              Start
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
    </>
  );
}

export default Home;
