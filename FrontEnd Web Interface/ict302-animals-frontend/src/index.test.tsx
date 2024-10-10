global.TextEncoder = require('util').TextEncoder;
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import ContextStore from './Internals/ContextStore';

test('TextEncoder is globally defined in Jest', () => {
  expect(global.TextEncoder).toBeDefined();
});

test('TextDecoder decodes byte arrays', () => {
  const bytes = new Uint8Array([84, 101, 115, 116]);
  const decoder = new TextDecoder('utf-8');
  const result = decoder.decode(bytes);
  expect(result).toBe('Test');
});

test('Renders app without crashing', () => {
  const div = document.createElement('div')
    ReactDOM.render(
      <BrowserRouter>
          <ContextStore>
            <App />
          </ContextStore>
      </BrowserRouter>, div);


});