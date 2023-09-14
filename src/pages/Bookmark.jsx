import React, { useEffect, useRef, useState } from "react";
import { Navbar, Container, Nav, NavDropdown, Image, NavLink, Button } from 'react-bootstrap';
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
import { newQID, removeDuplicates } from "../common";
import SpeedRef from "./Modal/SpeedRef";
import AskMentor from "./Modal/AskMentor";
import { bookmarkActions } from "../redux/bookmark";
import Loader from "./Loader";

function Bookmark() {
  const dispatch = useDispatch();
  const bookmark = useSelector(state => state.bookmark);
  const auth = useSelector(state => state.auth);

  const [loader, setLoader] = useState(false);

  console.log("questionid  ", bookmark.questionid);
  console.log("questionlist  ", bookmark.questionlist);

  const formref = useRef(null);

  const navigate = useNavigate();


  const { register, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm();




  const handleNext = async () => {
    var index = bookmark.count;
    if (bookmark.count < (bookmark.totalQuestion - 1)) {

      index = index + 1;

      dispatch(bookmarkActions.count(index));

      // setCurrentIndex();
      // console.log(currentIndex, 'currentIndex')
      // await saveAnswerObj();
      await getquestiondata(`qid${index}`);

    }

  };

  const handlePrevious = async () => {
    // console.log(currentIndex, 'currentIndex')
    var index = bookmark.count;
    if (bookmark.count > 0) {
      index = index - 1;

      dispatch(bookmarkActions.count(index));


      // setCurrentIndex(user.questionid.length - 1);

      // await saveAnswerObj();

      await getquestiondata(`qid${index}`);
    }
  };


  const handleFirst = async () => {
    dispatch(bookmarkActions.count(0));

    // await saveAnswerObj();
    await getquestiondata(`qid0`);
  }

  const handleLast = async () => {
    var index = (bookmark.totalQuestion - 1);
    dispatch(bookmarkActions.count(index));
    // await saveAnswerObj();
    await getquestiondata(`qid${bookmark.totalQuestion - 1}`);
  }

  var getFristquestiondata = async () => {

    setLoader(true);

    // alert(11)
    let form = new FormData();
    form.append("user_id", auth.user_id);

    // ==== answer form reset ========

    var response = await userService.BookmarkList(form);

    console.log("BookmarkList  ", response.data)

    if (response.data.status) {

      dispatch(bookmarkActions.questionlist(response.data.ques));
      dispatch(bookmarkActions.questionid(response.data.question_ids));
      dispatch(bookmarkActions.totalQuestion(response.data.question_count));
      dispatch(bookmarkActions.subject_name(response.data.subject_name));
      dispatch(bookmarkActions.radMode(1));
      // dispatch(bookmarkActions.speedRefFileLink(responce.data.speed_reference_file_path))
      // dispatch(bookmarkActions.subject_id(data.lstSubject))
    } else {
      dispatch(bookmarkActions.questionReset());
      // toast.warning("No Bookmark Question Found");
    }

    setLoader(false);

  }

  var getquestiondata = async (q_id) => {
    // alert(q_id)
    // let q_id = currentId.value
    console.log(q_id, "  q_id");
    console.log(bookmark.questionid[q_id], "  q_value");

    // ==== answer form reset ========




    if (q_id !== "") {
      let datas = {
        "next_qid": bookmark.questionid[q_id]
      }

      console.log(datas)

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

        console.log("faqdata ", response.data)


        dispatch(bookmarkActions.questionlist(response.data.ques));
        dispatch(bookmarkActions.speedRefFileLink(response.data.speed_reference_file_path))

        if (response.data.ques.ans.length > 1) {
          if (formref.current !== null) {
            formref.current.reset();
            var form = formref.current;
            // =============== check box ============= //
            form.querySelector('#t_test1').className = '';
            form.querySelector('#t_test2').className = '';
            form.querySelector('#t_test3').className = '';
            form.querySelector('#t_test4').className = '';

          }

          reset();


          setValue("ans_type", "checkbox")

        } else {

          if (formref.current !== null) {
            formref.current.reset();

            var form = formref.current;
            form.querySelector('#t_test1').className = '';
            form.querySelector('#t_test2').className = '';
            form.querySelector('#t_test3').className = '';
            form.querySelector('#t_test4').className = '';
          }

          reset();



          setValue("ans_type", "radio")

        }

      }


    }
    else {
      console.log("not get q_id")
    }
  }


  var setPreviousAnsValue = async () => {

    // alert(1);
    var oldQA_obj = bookmark.answerObj;
    // bookmark.questionid[q_id]

    for (const [index, i] of oldQA_obj.entries()) {
      if (bookmark.questionlist.id === i.qid) {
        console.log("fffffff " + i.ans.length)
        if (bookmark.questionlist.ans.length > 1) {
          const myArray = i.ans.split("");
          console.log(`ans id == ${i.qid} === ${myArray}`)
          for (var j of myArray) {
            if (j === 'A') {
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




  }


  const checkAns = async (data) => {
    // e.preventDefault();




    if (data.ans_type === "checkbox") {

      if (!data.test1 && !data.test2 && !data.test3 && !data.test4) {
        toast.warning("Please select answer!!");
        return;
      }

      var form = formref.current;

      // =============== check box ============= //
      form.querySelector('#t_test1').className = '';
      form.querySelector('#t_test2').className = '';
      form.querySelector('#t_test3').className = '';
      form.querySelector('#t_test4').className = '';

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

      if (bookmark.questionlist.ans === answer) {

        // toast.success("your answer right");



        if (answer.includes('A')) {
          form.querySelector('#t_test1').className = 'right_ans';
        }

        if (answer.includes('B')) {
          form.querySelector('#t_test2').className = 'right_ans';
        }

        if (answer.includes('C')) {
          form.querySelector('#t_test3').className = 'right_ans';
        }

        if (answer.includes('D')) {
          form.querySelector('#t_test4').className = 'right_ans';
        }


      } else {
        // toast.error("Your answer wrong");


        // alert(bookmark.questionlist.ans.includes('A'))

        if (bookmark.questionlist.ans.includes('A')) {
          if (answer.includes('A')) {
            form.querySelector('#t_test1').className = 'right_ans';
          } else {
            form.querySelector('#t_test1').className = 'right_ans';
          }
        } else if (answer.includes('A')) {
          form.querySelector('#t_test1').className = 'wrong_ans';
        }

        if (bookmark.questionlist.ans.includes('B')) {
          if (answer.includes('B')) {
            form.querySelector('#t_test2').className = 'right_ans';
          } else {
            form.querySelector('#t_test2').className = 'right_ans';
          }
        } else if (answer.includes('B')) {
          form.querySelector('#t_test2').className = 'wrong_ans';
        }

        if (bookmark.questionlist.ans.includes('C')) {
          if (answer.includes('C')) {
            form.querySelector('#t_test3').className = 'right_ans';
          } else {
            form.querySelector('#t_test3').className = 'right_ans';
          }
        } else if (answer.includes('C')) {
          form.querySelector('#t_test3').className = 'wrong_ans';
        }

        if (bookmark.questionlist.ans.includes('D')) {
          if (answer.includes('D')) {
            form.querySelector('#t_test4').className = 'right_ans';
          } else {
            form.querySelector('#t_test4').className = 'right_ans';
          }
        } else if (answer.includes('D')) {
          form.querySelector('#t_test4').className = 'wrong_ans';
        }

        // form['c_test1'].className = 'sdf';
        // form['c_test2'].className = 'wer'
        // console.log("chekcans  ", data)
      }



    } else {
      if (data.answer === null) {
        toast.warning("Please select answer!!");
        return;
      }

      var form = formref.current;

      //  ============== radio ============= ///

      form.querySelector('#t_test1').className = '';
      form.querySelector('#t_test2').className = '';
      form.querySelector('#t_test3').className = '';
      form.querySelector('#t_test4').className = '';


      if (bookmark.questionlist.ans === data.answer) {

        // toast.success("your answer right");



        if (data.answer.includes('A')) {

          form.querySelector('#t_test1').className = 'right_ans';
        }
        else if (data.answer.includes('B')) {

          form.querySelector('#t_test2').className = 'right_ans';
        }
        else if (data.answer.includes('C')) {

          form.querySelector('#t_test3').className = 'right_ans';
        }
        else if (data.answer.includes('D')) {

          form.querySelector('#t_test4').className = 'right_ans';
        }


      } else {
        // toast.error("Your answer wrong");


        if (data.answer.includes('A')) {

          form.querySelector('#t_test1').className = 'wrong_ans';
        }
        else if (data.answer.includes('B')) {

          form.querySelector('#t_test2').className = 'wrong_ans';
        }
        else if (data.answer.includes('C')) {

          form.querySelector('#t_test3').className = 'wrong_ans';
        }
        else if (data.answer.includes('D')) {

          form.querySelector('#t_test4').className = 'wrong_ans';
        }

        if (bookmark.questionlist.ans.includes('A')) {

          form.querySelector('#t_test1').className = 'right_ans';
        }
        else if (bookmark.questionlist.ans.includes('B')) {

          form.querySelector('#t_test2').className = 'right_ans';
        }
        else if (bookmark.questionlist.ans.includes('C')) {

          form.querySelector('#t_test3').className = 'right_ans';
        }
        else if (bookmark.questionlist.ans.includes('D')) {

          form.querySelector('#t_test4').className = 'right_ans';
        }



      }

      console.log(`user ans=${data.answer} | ans=${bookmark.questionlist.ans}`)


    }

    // if (data.test1) {
    //   console.log(data.test1)
    // }

    // if (data.test2) {
    //   console.log(data.test2)
    // }

    // setValue("answer", "D")

  }


  const saveAnswerObj = async () => {



    // console.log("form ",form)

    // alert(`${form['test1'].checked} ${form['test2'].value}`)
    // return;
    var ans_type = getValues("ans_type");

    console.log("ans_type ", ans_type)

    if (ans_type === "checkbox") {

      var test1 = getValues('test1');
      var test2 = getValues('test2');
      var test3 = getValues('test3');
      var test4 = getValues('test4');

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

        const ans_status = answer === bookmark.questionlist.ans ? true : false;

        var newQA_obj = { "qid": bookmark.questionlist.id, "ans": answer, "status": ans_status }


        var oldQA_obj = bookmark.answerObj;

        console.log("oldQA_obj  ", Object.keys(oldQA_obj));

        if (oldQA_obj.length > 0) {
          var run_status = true;

          for (const [index, i] of oldQA_obj.entries()) {
            if (bookmark.questionlist.id === i.qid) {
              // var newQA_obj={"qid":user.questionlist.id,"ans":userAns,"status":ans_status};
              // oldQA_obj[index].ans = answer;
              // oldQA_obj[index].status = ans_status;

              var obj = { index, answer, ans_status };

              dispatch(bookmarkActions.answerObjUpdate(obj));
              run_status = false;
              break;
            }
          }

          if (run_status) {
            // oldQA_obj.push(newQA_obj);

            // dispatch(bookmarkActions.answerObj(oldQA_obj));

            dispatch(bookmarkActions.answerObjAdd(newQA_obj));
          }

          // console.log("new oldQA_obj  ", oldQA_obj);


        }

        if (oldQA_obj.length === 0) {
          // oldQA_obj.push(newQA_obj);
          // console.log(oldQA_obj)
          // dispatch(bookmarkActions.answerObj(oldQA_obj));
          dispatch(bookmarkActions.answerObjAdd(newQA_obj));
        }


      }

      console.log(`save === test1=${test1} | test2=${test2} | test3=${test3} | test4=${test4} `)

    } else {

      var answer = getValues('answer');

      if (answer !== null) {

        const ans_status = answer === bookmark.questionlist.ans ? true : false;

        var newQA_obj = { "qid": bookmark.questionlist.id, "ans": answer, "status": ans_status }

        var oldQA_obj = bookmark.answerObj;

        console.log("oldQA_obj  ", oldQA_obj);

        if (oldQA_obj.length > 0) {
          var run_status = true;

          for (const [index, i] of oldQA_obj.entries()) {
            if (bookmark.questionlist.id === i.qid) {
              // var newQA_obj={"qid":user.questionlist.id,"ans":userAns,"status":ans_status};
              // oldQA_obj[index].ans = answer;
              // oldQA_obj[index].status = ans_status;

              var obj = { index, answer, ans_status };

              dispatch(bookmarkActions.answerObjUpdate(obj));
              run_status = false;
              break;
            }
          }

          if (run_status) {
            // oldQA_obj.push(newQA_obj);

            // dispatch(bookmarkActions.answerObj(oldQA_obj));

            dispatch(bookmarkActions.answerObjAdd(newQA_obj));
          }

          // console.log("new oldQA_obj  ", oldQA_obj);


        }

        if (oldQA_obj.length === 0) {
          // oldQA_obj.push(newQA_obj);
          // console.log(oldQA_obj)
          // dispatch(bookmarkActions.answerObj(oldQA_obj));
          dispatch(bookmarkActions.answerObjAdd(newQA_obj));
        }

      }

      console.log(`save === answer=${answer} `);
    }



  }


  const answersubmit = async () => {


    if ((Number(bookmark.count) === Number(bookmark.totalQuestion - 1)) && (Number(bookmark.answerObj.length) === (Number(bookmark.totalQuestion) - 1))) {

      // ======= checking ======== 
      var ans_type = getValues("ans_type");

      if (ans_type === "checkbox") {

        var test1 = getValues('test1');
        var test2 = getValues('test2');
        var test3 = getValues('test3');
        var test4 = getValues('test4');

        if (test1 || test2 || test3 || test4) {
          await saveAnswerObj();
          dispatch(bookmarkActions.ansSubmit(true));
        } else {
          toast.warning("please fillup all answer!!");
        }

      }
      else {
        var answer = getValues('answer');

        if (answer !== null) {
          await saveAnswerObj();
          dispatch(bookmarkActions.ansSubmit(true));
        } else {
          toast.warning("please fillup all answer!!");
        }
      }


    } else if ((Number(bookmark.count) === Number(bookmark.totalQuestion - 1)) && (Number(bookmark.answerObj.length) === Number(bookmark.totalQuestion))) {
      if (ans_type === "checkbox") {

        var test1 = getValues('test1');
        var test2 = getValues('test2');
        var test3 = getValues('test3');
        var test4 = getValues('test4');

        if (test1 || test2 || test3 || test4) {
          await saveAnswerObj();
          dispatch(bookmarkActions.ansSubmit(true));
        } else {
          toast.warning("please fillup all answer!!");
        }

      }
      else {
        var answer = getValues('answer');

        if (answer !== null) {
          await saveAnswerObj();
          dispatch(bookmarkActions.ansSubmit(true));
        } else {
          toast.warning("please fillup all answer!!");
        }
      }

    } else if (Number(bookmark.answerObj.length) < Number(bookmark.totalQuestion)) {
      toast.warning("please fillup all answer!!");
    }


  }


  const finalAnsSubmit = async () => {

    // alert(bookmark.answerObj.length)
    if ((Number(bookmark.count) === Number(bookmark.totalQuestion - 1)) && (Number(bookmark.answerObj.length) === Number(bookmark.totalQuestion))) {

      // toast.success("answer submit successfull");

      var currectQns = 0;
      var new_answerObj = [];

      for (var i of bookmark.answerObj) {

        if (i.status === true) {
          var newQA_obj = { "qid": i.qid, "ans": i.ans, "status": 1 }
          new_answerObj.push(newQA_obj)
          currectQns++;
        } else {
          var newQA_obj = { "qid": i.qid, "ans": i.ans, "status": 0 }
          new_answerObj.push(newQA_obj)
        }
      }

      console.log("new_answerObj  ", new_answerObj)

      var data = {
        "subid": bookmark.subject_id,
        "userId": auth.user_id,
        "ans_data": new_answerObj
      };

      var responce = await userService.AnswerSubmit(data);

      console.log("responce ans submit", responce.data)

      dispatch(bookmarkActions.ansSubmit(false));
      dispatch(bookmarkActions.totalCurrectAns(currectQns))
      // dispatch(bookmarkActions.questionReseltStatus(true))
      // dispatch(bookmarkActions.questionReseltChecked(true));
      dispatch(bookmarkActions.count(0));
      // await getquestiondata(`qid0`);

      navigate('/result');


    }

  }


  const removeBookmark = async () => {
    const form = new FormData();
    form.append("user_id", auth.user_id);
    form.append("question_id", bookmark.questionlist.id);

    console.log("remove question_id ", bookmark.questionlist.id);

    var responce = await userService.RemoveBookmark(form);

    console.log("AddBookmark ", responce.data)

    if (responce.data.status) {
      toast.success(responce.data.msg);
    } else {
      toast.error(responce.data.error);
    }

    await getFristquestiondata()

  }



  useEffect(() => {
    // alert(bookmark.questionid.length)
    // console.log(user.questionlist.ans.length, '  user.questionlist.ans.length ')
    if (bookmark.totalQuestion === 0) {
      getFristquestiondata();
    }
  }, [])

  // useEffect(() => {

  //   if ((bookmark.answerObj.length === Number(bookmark.totalQuestion)) && ((Number(bookmark.count)) === Number(bookmark.totalQuestion - 1)) && bookmark.ansSubmit === true) {
  //     finalAnsSubmit();
  //   }
  // }, [bookmark.ansSubmit])


  return (
    <>
    {loader && <Loader />}
      <section className="Money-Received">
        <div className="container">
          {/* ===== question and exam list ====== */}


          {bookmark.totalQuestion > 0 && <>
            <div className="Money-Received-box">
              <div className="money-header book-mark">
                <div className="money-h-left">
                <h2>Bookmark Questions</h2>
                  {/* <h6>{bookmark.subject_name}</h6> */}
                  {/* <select id="inputState" className="form-select">
                  <option selected="">Section #1</option>
                  <option>Section #2</option>
                </select> */}
                
                </div>
                <div className="money-h-middle">
              

                <ul className="pagination-wrap exam-pagination">
                  <li>
                    <a href="#" onClick={handlePrevious}>
                      <img src={prev} alt="prev" />
                      Previous Question
                    </a>
                  </li>
                  <li className="countnum">
                    
                    <span>{bookmark.count + 1}</span>/<span>{bookmark.totalQuestion}</span>
                  </li>
                  <li>
                    <a href="#" onClick={handleNext}>
                      Next Question
                      <img src={next} alt="next" />
                    </a>
                  </li>
                </ul>

              </div>
                
                <div className="money-h-right">

                  {/* <div className="pagination-res">
                  <span className="tr-fl">
                    <i className="fa-solid fa-circle-check" />
                  </span>
                  <span>true</span>
                  <span className="count">1</span>
                </div> */}
                </div>
              </div>
              <div className="money-re-content">


                <div className="content-left question_left">



                  <div className="ch-h">
                    <h3>{bookmark.subject_name}</h3>
                    <small>QID: {newQID(auth.user_id, bookmark.questionlist.id)} </small>

                  </div>
                  <p className="question">
                    {bookmark.questionlist.question}
                  </p>

                  <div id="monybgwater">
                    <p id="bg-text">{newQID(auth.user_id, bookmark.questionlist.id)}</p>
                  </div>
                </div>
                <div className="content-right">
                  <div className="ch-h">
                    <h3>Select An Answer</h3>
                  </div>


                  {/* ======== FORM 2 ANS length check =========  */}


                  <form ref={formref} onSubmit={handleSubmit(checkAns)} className="qiz">

                    {bookmark.questionlist?.ans.length > 1 && <>
                      <input type="hidden" {...register('ans_type')} value={"checkbox"} />
                      <p id="t_test1" className="clearfix">
                        <input type="checkbox" id="test1" {...register('test1')} value={"A"} disabled={bookmark.questionReseltChecked} />
                        <label htmlFor="test1">
                          {bookmark.questionlist.choice1}
                        </label>
                      </p>
                      <p id="t_test2" className="clearfix">
                        <input type="checkbox" id="test2"  {...register('test2')} value={"B"} disabled={bookmark.questionReseltChecked} />
                        <label htmlFor="test2">
                          {bookmark.questionlist.choice2}
                        </label>
                      </p>
                      <p id="t_test3" className="clearfix">
                        <input type="checkbox" id="test3"  {...register('test3')} value={"C"} disabled={bookmark.questionReseltChecked} />
                        <label htmlFor="test3">
                          {bookmark.questionlist.choice3}
                        </label>
                      </p>
                      <p id="t_test4" className="clearfix">
                        <input type="checkbox" id="test4"  {...register('test4')} value={"D"} disabled={bookmark.questionReseltChecked} />
                        <label htmlFor="test4">
                          {bookmark.questionlist.choice4}
                        </label>
                      </p>
                    </>}

                    {bookmark.questionlist?.ans.length === 1 && <>
                      <input type="hidden" {...register('ans_type')} value={"radio"} />
                      <p id="t_test1">
                        <input type="radio" id="answer1"  {...register('answer')} value={"A"} disabled={bookmark.questionReseltChecked} />
                        <label htmlFor="answer1">
                          {bookmark.questionlist.choice1}
                        </label>
                      </p>
                      <p id="t_test2">
                        <input type="radio" id="answer2"  {...register('answer')} value={"B"} disabled={bookmark.questionReseltChecked} />
                        <label htmlFor="answer2">
                          {bookmark.questionlist.choice2}
                        </label>
                      </p>
                      <p id="t_test3">
                        <input type="radio" id="answer3"  {...register('answer')} value={"C"} disabled={bookmark.questionReseltChecked} />
                        <label htmlFor="answer3">
                          {bookmark.questionlist.choice3}
                        </label>
                      </p>
                      <p id="t_test4">
                        <input type="radio" id="answer4"  {...register('answer')} value={"D"} disabled={bookmark.questionReseltChecked} />
                        <label htmlFor="answer4">
                          {bookmark.questionlist.choice4}
                        </label>
                      </p>
                    </>}

                    {(Number(bookmark.radMode) === 1) && <>
                      <Button type="submit" className="checkAns ">Check Ans</Button>
                    </>}




                  </form>




                  {/* ======== END FORM 2 ANS length check =========  */}

                  <div className="multiple-options">
                    <ul>
                      <li>
                        <a href="#" className="remove_bookmark" title="Remove Bookmark" onClick={removeBookmark}>
                          <img src={add} alt="add" />
                        </a>
                      </li>
                      {/* <li>
                      <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#searchpopup"
                        title="Speed Reference"
                      // onClick={speedRefhandleShow}
                      >
                        <img src={search} alt="search" />
                      </a>
                    </li> */}
                      {/* <li>
                      <a href="/translate" target="_blank" rel="noopener noreferrer" title="Translation">
                        <img src={translate} alt="translate" />
                      </a>
                    </li> */}
                      {/* <li>
                      <a
                        href="#"
                        data-bs-toggle="modal"
                        data-bs-target="#mentorpopup"
                        title="Ask a Mentor"
                      // onClick={aksMentorRefhandleShow}
                      >
                        <img src={query} alt="query" />
                      </a>
                    </li> */}
                    </ul>
                  </div>

                  <div id="monybgwater">
                    <p id="bg-text">{newQID(auth.user_id, bookmark.questionlist.id)}</p>
                  </div>
                </div>

              </div>




            </div>

            {/* <div className="btn-wrap exam-btn">

              {bookmark.count > 0 && <>
                <button className="animate-btn" onClick={handleFirst}>
                  First
                </button>
              </>}

              {bookmark.count > 0 && <>
                <button className="animate-btn" onClick={handlePrevious}>
                  Prev
                </button>
              </>}

              {bookmark.count <= (bookmark.totalQuestion - 2) && <>
                <button className="animate-btn" onClick={handleNext}>
                  Next
                </button>
              </>}

              {bookmark.count <= (bookmark.totalQuestion - 2) && <>
                <button onClick={handleLast} className="animate-btn">
                  Last
                </button>
              </>}

            </div> */}
          </>}


          {bookmark.totalQuestion === 0 && <>
            <div className="Money-Received-box">
              <div className="money-header result-header">

              </div>

              <div className="result-content">
                <div className="content-middle">
                  <h4>No Bookmark Question Found</h4>
                </div>

              </div>
            </div>
          </>}


          {/* ======== review ===== */}

        </div>

      </section>



      {/* ======== custom modal ======== */}
      <SpeedRef />

      <AskMentor />

    </>
  )
}

export default Bookmark