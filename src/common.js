import userService from './services/user.service';

export const removeDuplicates = async (inputString) => {

    // const arr = str.split("");
    // const arr2 = [];

    // arr.forEach((el, i) => {
    //     if (!arr2.includes(el)) {
    //         arr2.push(el);
    //     }
    // });
    // var new_str=  arr2.join("").replace(",", "").replace("", " ");
    // new_str=new_str.trim();

    // return new_str;

    // Step 1: Remove spaces
    const stringWithoutSpaces = inputString.replace(/\s+/g, '');

    // Step 2: Remove duplicate characters
    const uniqueCharacters = [...new Set(stringWithoutSpaces)];

    // Step 3: Join the unique characters back into a string
    const resultString = uniqueCharacters.join('');

    return resultString;
};

export const newQID=(member_id,qid, totalDigits=5)=>{
    const numberString = String(qid);
    const paddingLength = totalDigits - numberString.length;

    member_id=String(member_id).slice(0,5);
    
    if (paddingLength <= 0) {
        return (String(member_id)+numberString); // If the input already has more or equal digits than required, return it as-is.
    }
    
    const paddingZeros = '0'.repeat(paddingLength);
    const n_qid= paddingZeros + numberString;
    // console.log("n_qid",+member_id);
    return (String(member_id)+String(n_qid));
}
export const textcopy = async (user_id,email,token) => {
   
    const selectedText = window.getSelection().toString();
    
    // Do something with the selected text (e.g., display it in a console)
    // console.log('Selected Text:', selectedText);
    if(selectedText.length > 80){
        var data = {
            "user_id": user_id,
            "copied_text": String(selectedText),
            "user_email": email,
            "token": token
          };
        var responce = await userService.addcopytext(data);
        // console.log("copy text response", responce.data)
    }

  }

