import { Response } from "express";
import axios from "axios";
import { AuthenticatedRequest } from "../interface/AuthRequest.interface";
import { AUTH_SERVICE } from "../config/env";
import { CREATED, INTERNAL_SERVER_ERROR } from "../config/statusCode";
import { cleanXSS } from "../utils/sanitize";
import { asyncWrapper } from "../utils/asyncWrapper";

// This function handles user sign-up and sends the user data to an authentication service.
export const postUserSignup = asyncWrapper(
  async ({ body }: AuthenticatedRequest, res: Response) => {
    // Extract relevant fields from the request body
    const { username, email, password, confirmPassword } = body
    
    // Sanitize user input to prevent cross-site scripting (XSS) attacks
    const newData = {
      username: cleanXSS(username),
      email: cleanXSS(email),
      password: cleanXSS(password),
      confirmPassword: cleanXSS(confirmPassword)
    }
  
    // Make an HTTP POST request to the authentication service's signup endpoint
    await axios.post(`${AUTH_SERVICE}/user/signup`, newData)
      .then(response => {
        return res.status(CREATED).json(response)
      })
      .catch(error => {
        // If an error occurs, return an error message with a 500 (INTERNAL_SERVER_ERROR) status
        return res.status(INTERNAL_SERVER_ERROR).json({ message: error.message })
      })
  }
)

// This function handles user login and sends the user's credentials to an authentication service.
export const postUserLogin = async ({ body: { email, password } }: AuthenticatedRequest, res: Response) => {
  // Sanitize user input to prevent cross-site scripting (XSS) attacks
  const data = {
    email: cleanXSS(email),
    password: cleanXSS(password)
  }
  // Make an HTTP POST request to the authentication service's login endpoint
  await axios.post(`${AUTH_SERVICE}/user/login`, data)
    .then(response => {
      return res.status(CREATED).json(response)
    })
    .catch(error => {
      // If an error occurs, return an error message with a 500 (INTERNAL_SERVER_ERROR) status
      return res.status(INTERNAL_SERVER_ERROR).json({ message: error.message })
    })
}