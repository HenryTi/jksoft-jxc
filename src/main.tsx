import React from 'react'
import ReactDOM from 'react-dom/client'
import { Chart as ChartJS, registerables } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css'
import { ViewUqApp } from 'tonwa-app';
import { ViewsRoutes } from 'app/views';
import { createUqApp, UqApp } from 'app';
// import { ViewUqApp } from 'app';

ChartJS.register(...registerables);

const uqApp = createUqApp(); //new UqApp(appConfig, uqConfigs, uqsSchema, appEnv);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ViewUqApp uqApp={uqApp}>
            <ViewsRoutes />
        </ViewUqApp>
    </React.StrictMode>,
)
