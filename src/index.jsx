import React from 'react';
import { createRoot } from 'react-dom/client';
import AppWrapper from './AppWrapper';
import ErrorBoundary from './ErrorBoundary';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <ErrorBoundary cover="DataBinApp">
            <AppWrapper/>
        </ErrorBoundary>
    </React.StrictMode>
);