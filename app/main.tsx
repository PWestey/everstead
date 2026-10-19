import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './page';
import StartupRecovery from './startup-recovery';
import './globals.css';
import './everstead.css';
import './rs.css';
import './char.css';
createRoot(document.getElementById('root')!).render(<StartupRecovery><App/></StartupRecovery>);
