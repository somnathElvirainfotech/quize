import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './redux/store';

// ==== disable react devtools ==//
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

// == NODE_ENV is react default env variable
if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

// ====  end disable react devtools ==//

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);


