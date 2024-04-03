import { Response } from "express";
import axios from "axios";
import { AuthenticatedRequest } from "../interface/AuthRequest.interface";
import { AUTH_SERVICE } from "../config/env";
import { CREATED, EVERYTHING_OK, INTERNAL_SERVER_ERROR, NO_CONTENT } from "../config/statusCode";
import { asyncWrapper } from "../utils/asyncWrapper";
import { decoded } from "../utils/decoded";
import { UserExperience } from "../interface/UserExperience.interface";
import { Query } from "mysql";
import connection from "../config/mysql";

/**
 * Handles user sign-up via an HTTP POST request.
 * @method [POST]
 * @param {AuthenticatedRequest} req - Express request object with authentication details.
 * @param {Response} res - Express response object.
 */
// This function handles user sign-up and sends the user data to an authentication service.
export const postUserSignup = async ({ body }: AuthenticatedRequest, res: Response) => {
  // Make an HTTP POST request to the authentication service's signup endpoint
  await axios.post(`${AUTH_SERVICE}/user/signup`, body)
    .then(response => {
      const { data: { signup, token } } = response
      
      // If the signup response is false, return a 500 (Internal Server Error) status
      if (!signup) 
        return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Signup failed.' })
      
      // Construct a SQL query to insert user experience data into the database
      const query: string = 'INSERT INTO UserExperience SET ?'
      
      // Extract the user ID from the token (assuming a function called `decoded` exists)
      const { userID } = decoded(token)

      // Create an experience object with initial value of 0
      const experience: UserExperience = { 
        userId: userID,
        experience: 0
      }

      // Execute the database query to insert the experience record
      const expResponse: Query = connection.query(query, experience) 
      
      // If the database insertion fails, return a 500 (Internal Server Error) status
      if (!expResponse)
        return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error.' })
      
      // Return a 201 (Created) status along with the signup response
      return res.status(CREATED).json({ signup })
    })
    .catch(error => {
      // If an error occurs, return an error message with a 500 (INTERNAL_SERVER_ERROR) status
      return res.status(INTERNAL_SERVER_ERROR).json({ message: error.message })
    })
}

/**
 * Handles user login via an HTTP POST request.
 * @method [POST]
 * @param {AuthenticatedRequest} req - Express request object with authentication details.
 * @param {Response} res - Express response object.
 */
// This function handles user login and sends the user's credentials to an authentication service.
export const postUserLogin = async ({ body }: AuthenticatedRequest, res: Response) => {
  // Make an HTTP POST request to the authentication service's login endpoint
  await axios.post(`${AUTH_SERVICE}/user/login`, body)
    .then(response => {
      // If successful, return a 201 (Created) status and the response data
      return res.status(CREATED).json(response.data)
    })
    .catch(error => {
      // If an error occurs, return an error message with a 500 (INTERNAL_SERVER_ERROR) status
      return res.status(INTERNAL_SERVER_ERROR).json({ message: error.message })
    })
}

/**
 * Retrieves user information via an HTTP GET request.
 * @method [GET]
 * @param {AuthenticatedRequest} req - Express request object with authentication details.
 * @param {Response} res - Express response object.
 */
export const getUser = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    // Send an HTTP GET request to the AUTH_SERVICE endpoint
    await axios.get(`${AUTH_SERVICE}/user`, { 
      headers: {
        Authorization: req.headers.authorization
      }
    })
    .then(response => {
      // If the response data is empty, return a 500 (Internal Server Error) status
      if (!response.data)
        return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' })
      
      // Construct a SQL query to retrieve user experience data from the database
      const query: string = `SELECT * FROM UserExperience WHERE userId = ?`
      
      connection.query(query, response.data._id, (error, results, fields) => {
        if (error) throw error;
        
        // Combine the user data with experience information and return it
        return res.status(EVERYTHING_OK).json({ ...response.data, experience: results[0].experience  })
      })
    })
    .catch(error => {
      // If an error occurs, return a 500 (Internal Server Error) status
      // along with an error message
      return res.status(INTERNAL_SERVER_ERROR).json({ message: error.message })
    })
  }
)

/**
 * Updates user information via an HTTP PATCH request.
 * @method [PATCH]
 * @param {AuthenticatedRequest} req - Express request object with authentication details.
 * @param {Response} res - Express response object.
 */
export const patchUser = async (req: AuthenticatedRequest, res: Response) => {
  // Send an HTTP PATCH request to the AUTH_SERVICE endpoint
  await axios.patch(`${AUTH_SERVICE}/user`, req.body, { 
    headers: {
      Authorization: req.headers.authorization
    }
   })
    .then(response => {
      // If successful, return a 201 (Created) status and the response data
      return res.status(CREATED).json(response.data)
    })
    .catch(error => {
      // If an error occurs, return a 500 (Internal Server Error) status
      // along with an error message
      return res.status(INTERNAL_SERVER_ERROR).json({ message: error.message })
    })
}

/**
 * Deletes a user via an HTTP DELETE request.
 * @method [DELETE]
 * @param {AuthenticatedRequest} req - Express request object with authentication details.
 * @param {Response} res - Express response object.
 */
export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  const headers = {
    Authorization: req.headers.authorization
  }

  // Send an HTTP DELETE request to the AUTH_SERVICE endpoint
  await axios.delete(`${AUTH_SERVICE}/user`, {
    data: req.body, // Include the request body
    headers // Attach the authorization token
  })
    .then(response => {
      // If successful, return a 204 (No Content) status and the response data
      return res.status(NO_CONTENT).json(response.data)
    })
    .catch(error => {
      // If an error occurs, return a 500 (Internal Server Error) status
      // along with an error message
      return res.status(INTERNAL_SERVER_ERROR).json({ message: error.message })
    })
}