import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { getRouter } from './router';
import './styles.css';

const router = getRouter();
if (Capacitor.isNativePlatform()) {
  void App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) router.history.back();
    else void App.exitApp();
  });
}
createRoot(document.getElementById('root')!).render(
  <React.StrictMode><RouterProvider router={router} /></React.StrictMode>,
);
