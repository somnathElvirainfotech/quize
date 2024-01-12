import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user_id: 0,
  user_data:{},
  encrypt_user_id:''
};

const authSlice = createSlice ({
  name: 'authentication',
  initialState: initialState,
  reducers: {
    Login (state,action) {
      state.isAuthenticated = true;
      state.user_id=action.payload.id;
      state.user_data=action.payload;
    },
    Logout (state) {
      state.isAuthenticated = false;
      state.user_id=0;
      state.user_data={};
      state.encrypt_user_id="";
      localStorage.clear ();
      sessionStorage.clear();
    },
    Save_encrypt_value (state,action) {      
      state.encrypt_user_id=action.payload;
   
    },

  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;