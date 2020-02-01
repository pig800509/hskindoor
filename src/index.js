import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import './index.css';
import Main from './components/Main';
import registerServiceWorker from './registerServiceWorker';
import WebFontLoader from 'webfontloader';

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

ReactDOM.render(
	<Router>
    	<Main />
    </Router>,
  document.getElementById("root")
);
registerServiceWorker();

