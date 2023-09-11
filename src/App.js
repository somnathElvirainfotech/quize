import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.green.css';
import "./assets/css/style.css";
import './assets/css/responsive.css';
import './assets/js/custom.js'


import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BasePage from './pages/BasePage';
import Home from './pages/HomePage';
import Exam from './pages/Exam';
import Review from './pages/Review';
import Result from './pages/Result';
import Translate from './pages/Translate';
import { RequireAuth } from './Middleware';
import NotFound from './pages/NotFound';
// import Login from './pages/LoginPage';





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

        <BrowserRouter>
          <Routes>
            <Route path='' element={<BasePage />}>
              <Route index element={<Home />} />
              <Route path='exam' element={<RequireAuth><Exam /></RequireAuth>} />
              <Route path='review' element={<RequireAuth><Review /></RequireAuth>} />
              <Route path='result' element={<RequireAuth><Result /></RequireAuth>} />
            </Route>

            <Route path='/translate' element={<RequireAuth><Translate /></RequireAuth>} />

            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>


      </div>
    </>
  );
}

export default App;
