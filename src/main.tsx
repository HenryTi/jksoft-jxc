import React from 'react'
import ReactDOM from 'react-dom/client'
import { Chart as ChartJS, registerables } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css'
import { ViewUqApp } from 'app';

ChartJS.register(...registerables);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <ViewUqApp />
    </React.StrictMode>,
)
