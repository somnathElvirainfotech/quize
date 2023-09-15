import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import mentor from "../../assets/images/mentor.svg";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AsksMentorSchama } from "../../schema";
import userService from "../../services/user.service";
import { toast } from "react-toastify";
import { ColorRing } from 'react-loader-spinner'


function AskMentor() {
  const question = useSelector((state) => state.question);
  const auth = useSelector((state) => state.auth);
  const [loader,setLoader]=useState(false);
  const modalClose = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AsksMentorSchama),
  });
  const [termsAgree, setTermsAgree] = useState(false);
  const [termsArr, setTermsArr] = useState({
    t1: false,
    t2: false,
    t3: false,
  });

  const handleChange = (name) => {
    // console.log(e.target.name);
    var value;
    if (name === "t1") value = !termsArr.t1;
    else if (name === "t2") value = !termsArr.t2;
    else if (name === "t3") value = !termsArr.t3;
    setTermsArr({ ...termsArr, [name]: value });
  };

  const clearState = () => {
    setTermsAgree(false);
    setTermsArr({
      t1: false,
      t2: false,
      t3: false,
    });
    reset();
    setValue("txtemail", auth.user_data.email);
  };

  const submit = async (data) => {
    setLoader(true);


    data.qid = question.questionlist.id;
    console.log(data);

    var responce = await userService.AsksMentor(data);

    //   console.log(responce.data);
    modalClose.current.click();
    clearState();

    if (responce.data.status) {
      setLoader(false);

      if (responce.data.waring_status) {
        Swal.fire({
          title: "Warning",
          text: responce.data.msg,
          icon: "warning",
          confirmButtonText: "Ok",
        });
      } else {
        Swal.fire({
          title: "Successful",
          text: responce.data.msg,
          icon: "success",
          confirmButtonText: "Ok",
        });
      }
    } else {
      setLoader(false);
      Swal.fire({
        title: "Error",
        text: responce.data.error,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  useEffect(() => {
    clearState();
  }, [question.questionlist.id]);

  return (
    <>

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
                aria-label="Close"
                data-bs-dismiss="modal"
                onClick={clearState}
                ref={modalClose}
              />
              <h2>
                {" "}
                {!termsAgree && (
                  <>
                    <img src={mentor} alt="mentor" /> Ask A Mentor
                  </>
                )}
                {termsAgree && (
                  <>
                    <img src={mentor} alt="mentor" /> Ask A Mentor
                  </>
                )}
              </h2>
              {!termsAgree && <p>Please Read And Agree To The Following:</p>}
              <div className="check-wrap ad-check-wrap">
                {!termsAgree && (
                  <>
                    <ul>
                      <li>
                        <input
                          id="t1"
                          type="checkbox"
                          checked={termsArr.t1}
                          onChange={() => handleChange("t1")}
                        />
                        <label htmlFor="t1">
                          I have re-read the question and am certain I have not
                          misread it. (negatives noted e.g. "is NOT", "is
                          FALSE")
                        </label>
                      </li>
                      <li>
                        <input
                          id="t2"
                          type="checkbox"
                          checked={termsArr.t2}
                          onChange={() => handleChange("t2")}
                        />
                        <label htmlFor="t2">
                          I have read the explanation and study guide, but still
                          need a mentor to help me out.
                        </label>
                      </li>
                      <li>
                        <input
                          id="t3"
                          type="checkbox"
                          checked={termsArr.t3}
                          onChange={() => handleChange("t3")}
                        />
                        <label htmlFor="t3">
                          I agree to expect up to 3 business days for a reply.
                        </label>
                      </li>
                    </ul>

                    <Button
                      className="animate-btn mt-4"
                      onClick={() => {
                        if (!termsArr.t1 || !termsArr.t2 || !termsArr.t3) {
                          toast.warning(
                            "Please choose all options to proceed."
                          );
                        } else {
                          setTermsAgree(true);
                        }
                      }}
                    >
                      Proceed
                    </Button>
                    <h5 className="ask-m">Ask a mentor</h5>
                  </>
                )}

                {/* =============== Form =============  */}
                {termsAgree && (
                  <>
                    <form className="row" onSubmit={handleSubmit(submit)}>
                      <div className="col-md-12">
                        <label htmlFor="">Email Address </label>
                        <input type="email" {...register("txtemail")} />
                        <p
                          style={{ color: "red" }}
                          className="form-field-error"
                        >
                          {errors.txtemail?.message}
                        </p>
                      </div>

                      <div className="col-md-12">
                        <label htmlFor="">Type of Query </label>
                        <select {...register("sub")}>
                          <option selected value={"Need Clarification"}>
                            Need Clarification
                          </option>
                          <option value={"Potential Error"}>
                            Potential Error
                          </option>
                        </select>
                        <p
                          style={{ color: "red" }}
                          className="form-field-error"
                        >
                          {errors.sub?.message}
                        </p>
                      </div>

                      <div className="col-md-12">
                        <label htmlFor="">e-Book version </label>
                        <input type="text" {...register("txtEbook")} />
                        <p
                          style={{ color: "red" }}
                          className="form-field-error"
                        >
                          {errors.txtEbook?.message}
                        </p>
                      </div>

                      <div className="col-md-12">
                        <label htmlFor="">Your query </label>

                        <textarea {...register("reason")} />
                        <p
                          style={{ color: "red" }}
                          className="form-field-error"
                        >
                          {errors.reason?.message}
                        </p>
                      </div>

                      <div className="col-md-12">
                        <button className="sign-in " type="submit">
                          Click Once & Wait
                        </button>

                        <ColorRing
                            visible={loader}
                            height="80"
                            width="80"
                            ariaLabel="blocks-loading"
                            wrapperStyle={{}}
                            wrapperClass="blocks-wrapper"
                            colors={['#8dc63f','#8dc63f','#8dc63f','#8dc63f','#8dc63f']}
                          />

                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="mentor-Popup">
            <Modal
                {...props}
                onHide={props.onHide}
                animation={false}
                backdrop="static"
                keyboard={false}
                size="lg"
                centered
            >
                <Modal.Header className="btn-close"
                    aria-label="Close" closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h2>
                        {" "}
                        <img src={mentor} alt="mentor" /> Ask A Mentor
                    </h2>
                    <p>Please Read And Agree To The Following:</p>
                    <div className="check-wrap">
                        <ul>
                            <li>
                                <input type="checkbox" />
                                <label>
                                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                                    diam.
                                </label>
                            </li>
                            <li>
                                <input type="checkbox" />
                                <label>
                                    Nonumy eirmod tempor invidunt ut labore et dolore magna
                                    aliquyam erat.
                                </label>
                            </li>
                            <li>
                                <input type="checkbox" />
                                <label>
                                    At vero eos et accusam et justo duo dolores et ea rebum.
                                </label>
                            </li>
                            <li>
                                <input type="checkbox" />
                                <label>
                                    Stet clita kasd gubergren, no sea takimata sanctus est Lorem
                                    ipsum.
                                </label>
                            </li>
                        </ul>
                    </div>
                </Modal.Body>
                
            </Modal>
        </section> */}
    </>
  );
}

export default AskMentor;
