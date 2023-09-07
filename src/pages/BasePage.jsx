import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'
// import TokenHelper from './TokenHelper'
// import userService from '../services/user.service'
// import { userContext } from '../store';
// import { useContext } from 'react';

function BasePage() {

  // const { user, dispatch } = useContext(userContext);

  // useEffect(() => {

  //   var user_info = localStorage.getItem("userdata")
  //   console.log(user_info, 'user_info')
  //   if (user_info !== null && user.id === 0) {

  //     console.log(user_info, 'user_info')
  //     var nn=JSON.parse(user_info)
  //     dispatch({ type: "id", value: nn.id });
  //     dispatch({ type: "name", value: nn.name });
  //     dispatch({ type: "email", value: nn.email });
  //   }

  // }, [])

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default BasePage