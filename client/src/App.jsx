import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from './redux/store';
import AppRoutes from './routes/AppRoutes';
import { checkAuth } from './redux/slices/authSlice';

// A wrapper component to trigger initialization effects inside Redux context
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
    
    // Set theme on load
    const savedTheme = localStorage.getItem('color-theme') || 'light';
    const root = window.document.documentElement;
    if (savedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
