import React from 'react';
import { render} from '@testing-library/react';
import { screen } from "@testing-library/react";
import App from './App';

declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
  }
}

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeTruthy();
});
