import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    count: 0,
    questionlist: {},
    questionid: {},
    totalQuestion: 0,
    totalCurrectAns:0,
    subject_name: "",
    radMode: 0,
    answerObj: [],
    ansSubmit:false,
    questionReseltStatus:true,
    questionReseltChecked:false,
    speedRefFileLink:"",
    
};

const bookmarkSlice = createSlice({
    name: 'bookmark',
    initialState: initialState,
    reducers: {
        count(state, action) {
            state.count = action.payload;
        },
        questionlist(state, action) {
            state.questionlist = action.payload;
        },
        questionid(state, action) {
            state.questionid = action.payload;
        },
        totalQuestion(state, action) {
            state.totalQuestion = action.payload;
        },
        subject_name(state, action) {
            state.subject_name = action.payload;
        },
        radMode(state, action) {
            state.radMode = action.payload;
        },
        answerObjAdd(state, action) {
            state.answerObj = [...state.answerObj,action.payload];
        },
        answerObjUpdate(state, action) {
            state.answerObj[action.payload.index].ans = action.payload.answer;
            state.answerObj[action.payload.index].status = action.payload.ans_status;
        },
        questionReset(state) {
            state.count = 0;
            state.subject_id="";
            state.questionlist = {};
            state.questionid = {};
            state.totalQuestion = 0;
            state.subject_name = "";
            state.radMode = 0;
            state.answerObj = [];
            state.ansSubmit=false;
            state.questionReseltStatus=false;
            state.questionReseltChecked=false;
            state.totalCurrectAns=0;
            state.speedRefFileLink="";
            state.subject_id="";
        },
        ansSubmit(state,action){
            state.ansSubmit=action.payload;
        },
        questionReseltStatus(state,action){
            state.questionReseltStatus=action.payload;
        },
        questionReseltChecked(state,action){
            state.questionReseltChecked=action.payload;
        },
        totalCurrectAns(state,action){
            state.totalCurrectAns=action.payload;
        },
        speedRefFileLink(state,action){
            state.speedRefFileLink=action.payload;
        },
        subject_id(state,action){
            state.subject_id=action.payload;
        }
    },
});

export const bookmarkActions = bookmarkSlice.actions;
export default bookmarkSlice.reducer;