import * as yup from "yup";



export const LoginSchama = yup.object({
    email: yup.string().trim().email().required("email required"),
    password: yup.string().min(8,"password lengt must be 8 characters").required("password required")
});


export const AsksMentorSchama = yup.object({
    txtemail: yup.string().trim().email().required("Email Address Required"),
    sub:yup.string().trim().required("Query Type Required"),
    txtEbook:yup.string().trim().required("e-Book version Required"),
    reason:yup.string().trim().required("query Required")
});
















