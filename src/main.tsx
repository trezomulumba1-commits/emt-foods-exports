import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { RuntimeErrorBoundary } from './components/RuntimeErrorOverlay';
import { AppStateProvider } from './lib/AppStateProvider';
import { I18nProvider } from './lib/i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RuntimeErrorBoundary>
      <I18nProvider>
        <AppStateProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppStateProvider>
      </I18nProvider>
    </RuntimeErrorBoundary>
  </StrictMode>,
);
