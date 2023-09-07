import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav, NavDropdown, Image, NavLink, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginSchama } from "../schema";

import { QuestionSchama } from "./Schemas";
import TokenHelper from './TokenHelper'

import { useContext } from 'react';
import { userContext } from '../store';
import userService from '../services/user.service';
import { toast } from 'react-toastify';
import learnig from '../assets/images/learnig-mode.svg';
import exam from '../assets/images/exam-mode.svg';
import leftbanner from '../assets/images/login-left-img.png'
import { AuthContext } from '../App';
import LoginPage from "./LoginPage";
import { useDispatch, useSelector } from "react-redux";
import question, { questionActions } from "../redux/question";
import { removeDuplicates } from "../common";

function Home() {
    // const { user, dispatch } = useContext(userContext);

    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();




    const [Dropdowndata, setDropdowndata] = useState([]);
    // const [Dropdowndatavalue, setDropdowndatavalue] = useState([]);
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(QuestionSchama),
    });

    var Navigate = useNavigate();





    var submit = async (data) => {


        if (!auth.isAuthenticated) {
            toast.warning("Login Is Required!")
            return;
        }

        // alert(1)
        console.log(data)
        let chkRandom = data.chkRandom
        let chkHide = data.chkRandom
        if (chkRandom == 'true') {
            var checkRandom = '1'
        } else {
            var checkRandom = '0'
        }
        if (chkHide == 'true') {
            var checkH = '1'
        } else {
            var checkH = '0'
        }
        const form = new FormData();
        form.append("lstSubject", data.lstSubject);
        form.append("lstNum", data.lstNum);
        form.append("chkRandom", checkRandom);
        form.append("chkHide", checkH);
        form.append("radMode", data.radMode);
        form.append("type", "normal");
        form.append("userId", auth.user_id);
        var responce = await userService.Postquestion(form);



        console.log(responce.data);
        if (responce.data.error) {
            toast.error(responce.data.error)
        } else {
            console.log(responce.data.ques, 'jghjgjg')
            console.log(responce.data.question_ids, 'jghjgjg')

            let new_ans = await removeDuplicates(responce.data.ques.ans)

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
            dispatch(questionActions.totalQuestion(data.lstNum));
            dispatch(questionActions.subject_name(responce.data.subject_name));
            dispatch(questionActions.radMode(data.radMode));
            dispatch(questionActions.speedRefFileLink(responce.data.speed_reference_file_path))
            dispatch(questionActions.subject_id(data.lstSubject))

            Navigate('/exam')






        }



    }
    //   console.log(user_info,'user_info')

    var getdropdowndata = async () => {
        let mem_id = auth.user_id
        console.log(auth.user_id);
        if (mem_id !== "") {
            let datas = {
                "mem_id": mem_id,
                "engine_type": "normal"
            }
            var response = await userService.getlist(datas);
            console.log("faqdata ", response.data)

            console.log(mem_id)
            if (response.data.error) {

                setDropdowndata([])
            } else {
                var arr = []
                console.log(response.data.length)
                for (let i = 0; i < response.data.length; i++) {
                    var itemdata = response.data[i]
                    for (let i = 0; i < itemdata.length; i++) {
                        let dataitem = itemdata[i]
                        arr.push(dataitem)

                        console.log(dataitem, 'dataitem')
                    }
                    console.log(itemdata, 'aarayadata')
                }
                // setDropdowndata(response.data)
                // console.log(response.data, 'responsedata123')
                setDropdowndata(arr)
            }

        }
        else {
            console.log("not get token")
        }
    }


    // var arr=[]


    console.log(Dropdowndata, 'Dropdowndata')
    // console.log(itemdata,'itemdatalength')
    useEffect(() => {
        getdropdowndata();
        // setDropdowndatavalue(itemdata)
    }, [auth.isAuthenticated]);

    return (
        <>
            <section className="text-engine">
                <div className="container">
                    <div className="text-engine-content">
                        <h2>Classic Test Engine</h2>
                        <form className="row g-3 text-engine-frm" onSubmit={handleSubmit(submit)}>

                            <div className="col-md-6">
                                <label htmlFor="inputState" className="form-label">
                                    Pick A Question Set:
                                </label>
                                <select id="inputState" className="form-select" {...register('lstSubject')}>
                                    <option Value={""}>Choose a Filter below</option>

                                    {Dropdowndata && Dropdowndata.map((item) => {
                                        return (
                                            <option value={item.option_value}>{item.option}</option>
                                        )


                                    }
                                    )}
                                </select>
                                <p style={{ color: 'red' }} className='form-field-error'>{errors.lstSubject?.message}</p>
                            </div>
                            <div className="col-md-6 ">
                                <label htmlFor="inputState" className="form-label">
                                    How Many Questions To Load?
                                </label>
                                <select id="inputState" className="form-select" {...register('lstNum')}>
                                    <option selected="" value={10}>10 Questions</option>
                                    <option value={25}>25 Questions</option>
                                    <option value={40}>40 Questions</option>
                                    <option value={50}>50 Questions</option>
                                    <option value={60}>60 Questions</option>
                                    <option value={75}>75 Questions</option>
                                    <option value={80}>80 Questions</option>
                                    <option value={100}>100 Questions</option>
                                    <option value={200}>200 Questions</option>
                                </select>
                                <p style={{ color: 'red' }} className='form-field-error'>{errors.lstNum?.message}</p>
                            </div>
                            <div className="check-wrap">
                                <ul>
                                    <li>
                                        <input type="checkbox" defaultChecked {...register('chkRandom')} />
                                        <label htmlFor="">Random Sequence</label>
                                        <p style={{ color: 'red' }} className='form-field-error'>{errors.chkRandom?.message}</p>
                                    </li>
                                    <li>
                                        <input type="checkbox" defaultChecked {...register('chkHide')} />
                                        <label htmlFor="">Skip Cleared Questions</label>
                                        <p style={{ color: 'red' }} className='form-field-error'>{errors.chkHide?.message}</p>
                                    </li>
                                </ul>
                            </div>

                            <div className="mode-of-exam">
                                <h5>Mode Of Exam:</h5>
                                <div className="mode-of-exam-wrap subscription-container select-theme-wrap">
                                    <input type="radio" name="theme_id" id="card_one" value={1} defaultChecked {...register('radMode')} />
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
                                    </label>
                                </div>

                                <button type="submit" className="enter animate-btn" >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
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
    )
}

export default Home