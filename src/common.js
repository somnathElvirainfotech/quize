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
    
    if (paddingLength <= 0) {
        return (String(member_id)+numberString); // If the input already has more or equal digits than required, return it as-is.
    }
    
    const paddingZeros = '0'.repeat(paddingLength);
    const n_qid= paddingZeros + numberString;
    console.log("n_qid",+member_id);
    return (String(member_id)+String(n_qid));
}

