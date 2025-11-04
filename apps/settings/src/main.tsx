import React from 'react';
import ReactDOM from 'react-dom/client';
import { SettingsApp } from './app/SettingsApp';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);
root.render(<SettingsApp />);
