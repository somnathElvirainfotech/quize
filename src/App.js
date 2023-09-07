import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.green.css';
import "./assets/css/style.css";
import './assets/css/responsive.css';
import './assets/js/custom.js'


import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import { createContext, useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Store from "./store";
import BasePage from './pages/BasePage';
import { LoginAuth } from '../src/pages/LoginAuth';
import Home from './pages/HomePage';
import Exam from './pages/Exam';
import Review from './pages/Review';
import Result from './pages/Result';
import Translate from './pages/Translate';
// import Login from './pages/LoginPage';



export const AuthContext = createContext();
var initialValue = {}

function App() {

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
      <div className="App">
        {/* <AuthContext.Provider value={{ user: initialValue }} > */}

        <BrowserRouter>
          <Routes>
            <Route path='' element={<BasePage />}>
              <Route index element={<Home />} />
              <Route path='/exam' element={<Exam />} />
              {/* <Route path='/login' element={<Login />} /> */}
              <Route path='review' element={<Review />} />
              <Route path='result' element={<Result />} />
            </Route>

            <Route path='/translate' element={<Translate />} />
          </Routes>
        </BrowserRouter>


      </div>
    </>
  );
}

export default App;
