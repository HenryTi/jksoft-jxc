import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css';
import './index.css'
import { ViewUqApp } from 'tonwa-app';
import { ViewsRoutes } from 'app/views';
import { createUqApp } from 'app';

const uqApp = createUqApp();
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ViewUqApp uqApp={uqApp}>
            <ViewsRoutes />
        </ViewUqApp>
    </React.StrictMode>,
)
