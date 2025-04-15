import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { HeroUIProvider } from '@heroui/react';
import { Provider } from 'react-redux';
import store from './redux/store';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HeroUIProvider>
        <main className="dark">
          <App />
        </main>
      </HeroUIProvider>
    </Provider>
  </StrictMode>
);
