import React, { createContext, useReducer } from "react";
import { getLocal, getSession } from "./StoreCommonFnc";

const InitialState = {
    id: 0,
    name: "",
    email: "",
    loginstatus: "",
    loginsession: "",
    count: getSession("count", 0),
    questionlist: getSession("questionlist", {}),
    questionid: getSession("questionid", {}),
    totalQuestion: getSession("totalQuestion", 0),
    subject_name: getSession("subject_name", ""),
    radMode: getSession("radMode", 0),
    answerObj: getSession("answerObj", []),
    showLoginModal: false


};

function reducer(state, action) {
    switch (action.type) {
        case "id":
            return {
                ...state,
                id: action.value,
            };
        case "name":
            return {
                ...state,
                name: action.value,
            };
        case "email":
            return {
                ...state,
                email: action.value,
            };
        case "showLoginModal":
            return {
                ...state,
                showLoginModal: action.value
            }
        case "questionlist":
            var questionlist = JSON.stringify(action.value)
            sessionStorage.setItem("questionlist", questionlist)
            return {
                ...state,
                questionlist: { ...action.value },
            };
        case "questionid":
            var questionid = JSON.stringify(action.value)
            sessionStorage.setItem("questionid", questionid)
            return {
                ...state,
                questionid: { ...action.value },
            };

        case "totalQuestion":
            var totalQuestion = JSON.stringify(action.value)
            sessionStorage.setItem("totalQuestion", totalQuestion)
            return {
                ...state,
                totalQuestion: action.value,
            };
        case "subject_name":
            var subject_name = JSON.stringify(action.value)
            sessionStorage.setItem("subject_name", subject_name)
            return {
                ...state,
                subject_name: action.value
            }
        case "radMode":
            var radMode = JSON.stringify(action.value)
            sessionStorage.setItem("radMode", radMode)
            return {
                ...state,
                radMode: action.value
            }
        case "count":
            var count = JSON.stringify(action.value)
            sessionStorage.setItem("count", count)
            return {
                ...state,
                count: action.value
            }
        case "answerObj":
            var answerObj = JSON.stringify(action.value)
            sessionStorage.setItem("answerObj", answerObj)
            return {
                ...state,
                answerObj: action.value
            }
        case "reset":
            return { ...InitialState };

        default:
            return { ...state };
    }
}

export const userContext = createContext();

function Store({ children }) {
    const [user, dispatch] = useReducer(reducer, InitialState);


    return (
        <userContext.Provider value={{ user, dispatch }}>
            {children}
        </userContext.Provider>
    );
}

export default Store;
