// Import modules
import { NODE_ENV } from '../config/env';

// Define a function to log information
export const logInfo = (...params: [string]) => {
  // Check if NODE_ENV is set to 'development'
  if (NODE_ENV === 'development') {
    // Log the information to the console
    console.log(...params);
  }
};

// Define a function to log errors
export const logError = (...params: [unknown] | [string, Error]) => {
  // Check if NODE_ENV is set to 'development'
  if (NODE_ENV === 'development') {
    // Log the error to the console
    console.error(...params);
  }
};
