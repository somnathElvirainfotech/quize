import * as yup from "yup";

export const LoginSchama = yup.object({
  user_type: yup.string().required("User Type Required"),
  email: yup.string().email().required(),
  password: yup.string().min(10).required()
});
export const QuestionSchama = yup.object({
  lstSubject: yup.string().required("Required"),
  lstNum: yup.string().required("Required"),
  chkRandom: yup.string().required("check random Required"),
  chkHide: yup.string().required("Check Required"),
  radMode: yup.string().required("Radmode Required"),
 
 
})
export const referencesSchema = yup.object({
  first_reference: yup.string().required("First Reference Required"),
  second_reference: yup.string().required("Second Reference Required"),
  third_reference: yup.string().required("Third Reference Required")
});
export const medicalSchema = yup.object({
  mmr_vaccine: yup.string().required("Vaccine Required"),
  hepatitis_vaccine: yup.string().required("Hepatities Required"),
 
});

export const licenseDataSchema = yup.object({
  national_license_issue_date: yup.string().required("National License Issue Date Require"),
  national_license_expiry_date: yup.string().required("National License Expiry Date Require"),
//   national_license_file:yup.mixed().test("required", "Please select a file", value => {
//         return value && value.length;
//     }).test({
//             message: 'Please provide a supported file type (pdf,doc,docx)',
//             test: (file, context) => {
//                 const isValid = ['pdf', 'doc', 'docx'].includes(getExtension(file[0]?.name));
//                 if (!isValid) context?.createError();
//                 return isValid;
//             }
//         }),
  state_license_issue_date:yup.string().required("State License Issue Date Require"),
  state_license_expiry_date:yup.string().required("State License Expiry Date Require"),
//   state_license_file:yup.mixed().test("required", "Please select a file", value => {
//     return value && value.length;
// }).test({
//         message: 'Please provide a supported file type (pdf,doc,docx)',
//         test: (file, context) => {
//             const isValid = ['pdf', 'doc', 'docx'].includes(getExtension(file[0]?.name));
//             if (!isValid) context?.createError();
//             return isValid;
//         }
//     }),
  cds_license_issue_date:yup.string().required("CDS License Issue Date Require"),
  cds_license_expiry_date:yup.string().required("CDS License Expiry Date Require"),
//   cds_license_file:yup.mixed().test("required", "Please select a file", value => {
//     return value && value.length;
// }).test({
//         message: 'Please provide a supported file type (pdf,doc,docx)',
//         test: (file, context) => {
//             const isValid = ['pdf', 'doc', 'docx'].includes(getExtension(file[0]?.name));
//             if (!isValid) context?.createError();
//             return isValid;
//         }
//     }),
  dea_license_issue_date:yup.string().required("DEA License Issue Date Require"),
  dea_license_expiry_date:yup.string().required("DEA License Expiry Date Require"),
//   dea_license_file:yup.mixed().test("required", "Please select a file", value => {
//     return value && value.length;
// }).test({
//         message: 'Please provide a supported file type (pdf,doc,docx)',
//         test: (file, context) => {
//             const isValid = ['pdf', 'doc', 'docx'].includes(getExtension(file[0]?.name));
//             if (!isValid) context?.createError();
//             return isValid;
//         }
//     }),
    // licenseInfo:yup.array(yup.object({
    //   license_name:yup.string().required("License name Required"),
    //   license_file:yup.mixed().test("required", "Please select a file", value => {
    //     return value && value.length;
    // }).test({
    //         message: 'Please provide a supported file type (doc,docx,pdf)',
    //         test: (file, context) => {
    //             const isValid = ['pdf', 'doc', 'docx'].includes(getExtension(file?.name));
    //             if (!isValid) context?.createError();
    //             return isValid;
    //         }
    //     }),
    //     license_issue_date:yup.string().required("License issue Date Required"),
    //     license_expiry_date:yup.string().required("License end Date Required"),
  
    // })),
});


// export const licenseSchema=yup.object({
  // licenseInfo:yup.array(yup.object({
  //   license_name:yup.string().required("License name Required"),
  //   additional_license:yup.mixed().test("required", "Please select a file", value => {
  //     return value && value.length;
  // }).test({
  //         message: 'Please provide a supported file type (png,jpg,jpeg)',
  //         test: (file, context) => {
  //             const isValid = ['pdf', 'doc', 'docx'].includes(getExtension(file[0]?.name));
  //             if (!isValid) context?.createError();
  //             return isValid;
  //         }
  //     }),
  //    license_issue_date:yup.string().required("License issue Date Required"),
  // license_expiry_date:yup.string().required("License end Date Required"),

  // })),
 
// });
export const CertificationSchema = yup.object({
  bls_issue_date: yup.string().required("BLS Certificate Issue Date Require"),
  bls_expiry_date: yup.string().required("BLS Certificate Expiry Date Require"),
//   bls_file:yup.mixed().test("required", "Please select a file", value => {
//         return value && value.length;
//     }).test({
//             message: 'Please provide a supported file type (pdf,doc,docx)',
//             test: (file, context) => {
//                 const isValid = ['pdf', 'doc', 'docx'].includes(getExtension(file[0]?.name));
//                 if (!isValid) context?.createError();
//                 return isValid;
//             }
//         }),
        acls_issue_date:yup.string().required("ACLS Certificate Issue Date Require"),
        acls_expiry_date:yup.string().required("ACLS Certificate Expiry Date Require"),
//         acls_file:yup.mixed().test("required", "Please select a file", value => {
//     return value && value.length;
// }).test({
//         message: 'Please provide a supported file type (pdf,doc,docx)',
//         test: (file, context) => {
//             const isValid = ['pdf', 'doc', 'docx'].includes(getExtension(file[0]?.name));
//             if (!isValid) context?.createError();
//             return isValid;
//         }
//     }),
    pls_issue_date:yup.string().required("PLS Certificate Issue Date Require"),
    pls_expiry_date:yup.string().required("PLS Certificate Expiry Date Require"),
//     pls_file:yup.mixed().test("required", "Please select a file", value => {
//     return value && value.length;
// }).test({
//         message: 'Please provide a supported file type (pdf,doc,docx)',
//         test: (file, context) => {
//             const isValid = ['pdf', 'doc', 'docx'].includes(getExtension(file[0]?.name));
//             if (!isValid) context?.createError();
//             return isValid;
//         }
//     }),

});
export const CurrentEmployeSchema =yup.object({
  job_name: yup.string().required("Job Name Required"),
  job_type: yup.string().required("Job Type Required"),
});
export const educationSchema=yup.object({
  ug_institute_name: yup.string().required("Name Required"),
  g_institute_name: yup.string().required("Name Required"),
  med_institue_name: yup.string().required('name required'),
  ug_from_year: yup.string().required("choose date"),
  ug_to_year: yup.string().required("choose date"),
  g_from_year: yup.string().required("choose date"),
  g_to_year: yup.string().required("choose date"),
  med_school_from_year: yup.string().required("choose date"),
  med_school_to_year: yup.string().required("choose date"),
});
const phoneRegExps = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const RegistrationSchema = yup.object().shape({
  user_type: yup.string().required("User Type Required"),
  name: yup.string().required("Full Name Required"),
  only_mobile_no: yup.string().matches(phoneRegExps, 'Phone number is not valid'),
  email: yup.string().email().required("email required"),
  country_code: yup.string().required("select country code"),

  password: yup.string().min(10).required(),
  conpassword: yup.string().min(10).required().oneOf([yup.ref("password")], "confirm password not match"),

})


function getExtension(path) {

  if (path !== undefined) {

      var basename = path.split(/[\\/]/).pop(),  // extract file name from full path ...
          // (supports `\\` and `/` separators)
          pos = basename.lastIndexOf(".");       // get last position of `.`

      if (basename === "" || pos < 1)            // if file name is empty or ...
          return "";                             //  `.` not found (-1) or comes first (0)

      return basename.slice(pos + 1);            // extract extension ignoring `.`
  } else {
      return "";
  }
}