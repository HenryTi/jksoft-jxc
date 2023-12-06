import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css'
import { ViewMain } from './app';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ViewMain />
    </React.StrictMode>,
)
