import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';


// basename = PUBLIC_URL (set to /experience at build time via the
// "homepage" field in package.json). This makes BrowserRouter strip the
// /experience prefix so the app's existing routes ("/", "/dashboard/*")
// match exactly as they do when run standalone on the V2 dev server
// (where PUBLIC_URL is empty → basename ""). Without this, the browser
// path /experience matches no route and React renders nothing.
const basename = process.env.PUBLIC_URL || undefined;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


