import { Response, response } from "express";
import { AuthenticatedRequest } from "../interface/AuthRequest.interface";
import axios from "axios";
import { AUTH_SERVICE, WORDS_SERVICE } from "../config/env";
import { EVERYTHING_OK, INTERNAL_SERVER_ERROR } from "../config/statusCode";

/**
 * Retrieves a list of words via an HTTP GET request.
 * @method [GET]
 * @param {AuthenticatedRequest} req - Express request object with authentication details.
 * @param {Response} res - Express response object.
 */
export const getWords = async (req: AuthenticatedRequest, res: Response) => {
  // Send an HTTP GET request to the AUTH_SERVICE endpoint
  await axios.get(`${AUTH_SERVICE}/user`, { 
    headers: {
      Authorization: req.headers.authorization
    }
  })
  .then(async response => {
    // If the response data is empty, return a 500 (Internal Server Error) status
    if (!response.data)
      return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' })
    
    // Send an HTTP GET request to the WORDS_SERVICE endpoint to retrieve the list of words
    await axios.get(`${WORDS_SERVICE}/words`)
      .then(response => {
        // Return the word data with a 200 (Everything OK) status
        return res.status(EVERYTHING_OK).json(response.data)
      })
      .catch(error => {
        // If an error occurs, return an error message with a 500 (Internal Server Error) status
        return res.status(INTERNAL_SERVER_ERROR).json({ message: error.message })
      })
  })
  .catch(error => {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: error.message })
  })
}

/**
 * Retrieves a word via an HTTP GET request.
 * @method [GET]
 * @param {AuthenticatedRequest} req - Express request object with authentication details.
 * @param {Response} res - Express response object.
 */
export const getWord = async (req: AuthenticatedRequest, res: Response) => {
  // Send an HTTP GET request to the AUTH_SERVICE endpoint
  await axios.get(`${AUTH_SERVICE}/user`, { 
    headers: {
      Authorization: req.headers.authorization
    }
  })
  .then(async response => {
    // If the response data is empty, return a 500 (Internal Server Error) status
    if (!response.data)
      return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' })
    
    // Send an HTTP GET request to the WORDS_SERVICE endpoint with the provided word ID
    await axios.get(`${WORDS_SERVICE}/words/${req.params.id}`)
      .then(response => {
        // Return the word data with a 200 (Everything OK) status
        return res.status(EVERYTHING_OK).json(response.data)
      })
      .catch(error => {
        // If an error occurs, return an error message with a 500 (Internal Server Error) status
        return res.status(INTERNAL_SERVER_ERROR).json({ message: error.message })
      })
  })
  .catch(error => {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: error.message })
  }) 
}