import { Response } from "express";
import { AuthenticatedRequest } from "../interface/AuthRequest.interface";
import { asyncWrapper } from "../utils/asyncWrapper";
import connection from "../config/mysql";
import { CREATED, EVERYTHING_OK, INTERNAL_SERVER_ERROR, NO_CONTENT, UNAUTHORIZED } from "../config/statusCode";
import { UserExperience } from "../interface/UserExperience.interface";
import { Query } from "mysql";

/**
 * Retrieves experience information via an HTTP GET request.
 * @method [GET]
 * @param {AuthenticatedRequest} req - Express request object with authentication details.
 * @param {Response} res - Express response object.
 */
export const getExperience = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    // Check if the user is authenticated.
    if (!req.user)
      return res.status(UNAUTHORIZED).json({ message: 'USER_NOT_AUTHENTICATED' })

    // Define the SQL query to select all records from the UserExperience table where the userId matches the user's ID.
    const query: string = 'SELECT * FROM UserExperience WHERE userId = ?'
    // const query: string = 'SELECT { experience } FROM UserExperience WHERE userId = ?'
  
    // Execute the query using the database connection and the user's ID.
    const data: Query = await connection.query(query, req.user._id)

    // If no data is returned, handle it as an internal server error.
    if (!data)
      return res.status(INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL_SERVER_ERROR' })

    // Return a successful response with HTTP status code 200 (OK) and the retrieved data.
    return res.status(EVERYTHING_OK).json(data)
  }
)

/**
 * Handles experience via an HTTP POST request.
 * @method [POST]
 * @param {AuthenticatedRequest} req - Express request object with authentication details.
 * @param {Response} res - Express response object.
 */
export const postExperience = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    // Check if the user is authenticated.
    if (!req.user)
      return res.status(UNAUTHORIZED).json({ message: 'USER_NOT_AUTHENTICATED' })

    // Define the SQL query to insert a new record into the UserExperience table.
    const query: string = 'INSERT INTO UserExperience SET ?'

    // Create an experience object with initial values (user ID and experience set to 0).
    const experience: UserExperience = { 
      userId: req.user._id as string,
      experience: 0
    }

    // Execute the query using the database connection and the experience data.
    const data: Query = connection.query(query, experience)

    // If no data is returned, handle it as an internal server error.
    if (!data)
      return res.status(INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL_SERVER_ERROR' })

    // Return a successful response with HTTP status code 201 (CREATED).
    return res.status(CREATED).json(data)
  }
)

/**
 * Updates experience information via an HTTP PATCH request.
 * @method [PATCH]
 * @param {AuthenticatedRequest} req - Express request object with authentication details.
 * @param {Response} res - Express response object.
 */
export const patchExperience = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    // Check if the user is authenticated.
    if (!req.user)
      return res.status(UNAUTHORIZED).json({ message: 'USER_NOT_AUTHENTICATED' })

    // Define the SQL query to update the UserExperience table.
    const query: string = 'UPDATE UserExperience SET ? WHERE userId = ?'

    // Create a new experience object with updated values.
    const newExperience: UserExperience = { 
      userId: req.user._id as string, 
      experience: (req.user.experience + 10)
    }

    // Execute the query using the database connection and the new experience data.
    const data: Query = await connection.query(query, [newExperience, req.user._id])

    // If no data is returned, handle it as an internal server error.
    if (!data)
      return res.status(INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL_SERVER_ERROR' })
  
    // Return a successful response with HTTP status code 201 (CREATED).
    return res.status(CREATED).json(data)
  }
)

/**
 * Deletes a user via an HTTP DELETE request.
 * @method [DELETE]
 * @param {AuthenticatedRequest} req - Express request object with authentication details.
 * @param {Response} res - Express response object.
 */
export const deleteExperience = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    // Check if the user is authenticated.
    if (!req.user)
      return res.status(UNAUTHORIZED).json({ message: 'USER_NOT_AUTHENTICATED' })

    // Define the SQL query to delete records from the UserExperience table.
    const query: string = 'DELETE FROM UserExperience WHERE userId = ?'

    // Execute the query using the database connection and the user's ID.
    const data: Query = connection.query(query, req.user._id)

    // If no data is returned, handle it as an internal server error.
    if (!data)
      return res.status(INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL_SERVER_ERROR' })
  
    // Return a successful response with no content (HTTP status code 204).
    return res.status(NO_CONTENT).json(data)
  }
)
