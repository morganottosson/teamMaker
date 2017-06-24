import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './components/app.js'
import Login from './components/login.js';

ReactDOM.render((
     <BrowserRouter>
        <div>
          <Route path="/" component={App}/>
          <Route path="/login" compenent={Login}/>
        </div>
     </BrowserRouter>
     ),
     document.getElementById('app')
);