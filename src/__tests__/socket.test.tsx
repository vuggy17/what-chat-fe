/* eslint-disable global-require */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

describe('Join', () => {
  const mockEmitter = jest.fn();
  let App;
  beforeEach(() => {
    // App = require('./app').default;
    jest.mock('socket.io-client', () => {
      const mockedSocket = {
        emit: mockEmitter,
        on: jest.fn(),
      };
      return jest.fn(() => mockedSocket);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // it('joins a chat', () => {
  //   // Arrange
  //   render(<App />);
  //   const btn = screen.getByTestId('join-button');

  //   // Act
  //   fireEvent.click(btn);

  //   // Assert
  //   expect(btn).toBeInTheDocument();
  //   expect(mockEmitter).toHaveBeenCalled();
  // });
});
