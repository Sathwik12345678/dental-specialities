import React from 'react';
import { createRoot } from 'react-dom/client';

// Every former site page is now a React module in src/pages.
const pages = import.meta.glob('./pages/**/*.jsx', { eager: true, import: 'default' });

function resolvePage() {
  const path = decodeURIComponent(window.location.pathname);
  const route = path === '/' || path === ''
    ? 'index'
    : path.replace(/^\/+/, '').replace(/\.html$/i, '').replace(/\/$/, '/index');
  return pages[`./pages/${route}.jsx`] || pages['./pages/404.jsx'];
}

function App() {
  const Page = resolvePage();
  return <Page />;
}

createRoot(document.getElementById('root')).render(<App />);
