import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import { App } from './app/app';
import './styles.css';
import {AppProviders} from "./app/providers/app-providers";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </ AppProviders>
  </StrictMode>,
);
