import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import './index.css';

ReactDom.render(
    <React.StrictMode>
        <ErrorBoundary cover="DataBinApp">
            <App/>
        </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById('root')
);