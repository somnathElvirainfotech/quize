import React, { useEffect } from "react";
import "../assets/css/translator.css";
import { useSelector } from "react-redux";
import logo from "../assets/images/logo.png";
import moment from "moment";
import { newQID } from "../common";

function Translate() {
  const question = useSelector((state) => state.question);
  const auth = useSelector((state) => state.auth);

  return (
    <>
      <div id="google_translate_element"></div>
      <img src={logo} alt="CMFAS Academy Logo" height="40" width="160" />
      <p>
        <br />
        <br />
        <div id="background">
          <p id="bg-text">{newQID(auth.user_id,question.questionlist.id)}</p>
        </div>
        <div id="content">
          ({question.subject_name}) | QID: {newQID(auth.user_id,question.questionlist.id)} |{" "}
          {moment().format("YYYY-MM-DD")}
          <br />
          <br />
          Question: {question.questionlist.question}
          <br />
          <br />
          <p
            style={{
              color: question.questionlist.ans.includes("A")
                ? "green"
                : "black",
            }}
          >
            A) {question.questionlist.choice1}
          </p>
          <p
            style={{
              color: question.questionlist.ans.includes("B")
                ? "green"
                : "black",
            }}
          >
            B) {question.questionlist.choice2}
          </p>
          <p
            style={{
              color: question.questionlist.ans.includes("C")
                ? "green"
                : "black",
            }}
          >
            C) {question.questionlist.choice3}
          </p>
          <p
            style={{
              color: question.questionlist.ans.includes("D")
                ? "green"
                : "black",
            }}
          >
            D) {question.questionlist.choice3}
          </p>{" "}
          Answer:
          {question.questionlist.ans}
          <br />
          <br /> Explanation:
          <br />
          <br />
          {question.questionlist.explanation}
          <br />
          <br />
          <br /> Tip: If you are weak in English, you'll need more practice
          reading English questions. You should use the translation to validate
          your original understanding of the question, as well as to better
          understand the explanation for this question. Furthermore, the quality
          of the translation may vary, so it is not recommended to over-rely on
          translation.
          <br />
          <br />
          <p>
            © All rights reserved to CMFAS Academy. We do <strong>NOT</strong>{" "}
            allow the information here to be copied, stored, downloaded, saved,
            transferred, archived, photographed in any manner. We take a strong
            stance in protecting our intellectual property.
          </p>
        </div>
      </p>
    </>
  );
}

export default Translate;
