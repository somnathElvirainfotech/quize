export const getLocal=(varible_name,default_value)=>{

   var current_value= localStorage.getItem(varible_name) !== null ? JSON.parse(localStorage.getItem(varible_name)) : default_value;

   return current_value;
}


export const getSession=(varible_name,default_value)=>{

   var current_value= sessionStorage.getItem(varible_name) !== null ? JSON.parse(sessionStorage.getItem(varible_name)) : default_value;

   return current_value;
}