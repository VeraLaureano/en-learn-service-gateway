import { Response, query } from "express";
import { AuthenticatedRequest } from "../interface/AuthRequest.interface";
import { asyncWrapper } from "../utils/asyncWrapper";
import connection from "../config/mysql";
import { CREATED, EVERYTHING_OK, INTERNAL_SERVER_ERROR, NO_CONTENT, UNAUTHORIZED } from "../config/statusCode";
import { UserExperience } from "../interface/UserExperience.interface";
import { Query } from "mysql";

export const getExperience = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user)
      return res.status(UNAUTHORIZED).json({ message: 'USER_NOT_AUTHENTICATED' })

    const query: string = 'SELECT * FROM UserExperience WHERE userId = ?'
  
    const data: Query = await connection.query(query, req.user._id)

    if (!data)
      return res.status(INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL_SERVER_ERROR' })

    return res.status(EVERYTHING_OK).json(data)
  }
)

export const postExperience = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user)
      return res.status(UNAUTHORIZED).json({ message: 'USER_NOT_AUTHENTICATED' })

    const query: string = 'INSERT INTO UserExperience SET ?'

    const experience: UserExperience = { 
      userId: req.user._id as string,
      experience: 0
    }

    const data: Query = connection.query(query, experience)

    if (!data)
      return res.status(INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL_SERVER_ERROR' })

    return res.status(CREATED).json(data)
  }
)

export const patchExperience = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user)
      return res.status(UNAUTHORIZED).json({ message: 'USER_NOT_AUTHENTICATED' })

    const query: string = 'UPDATE UserExperience SET ? WHERE userId = ?'

    const newExperience: UserExperience = { 
      userId: req.user._id as string, 
      experience: (req.user.experience + 10)
    }

    const data: Query = await connection.query(query, [newExperience, req.user._id])

    if (!data)
      return res.status(INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL_SERVER_ERROR' })
  
    return res.status(CREATED).json(data)
  }
)

export const deleteExperience = asyncWrapper(
  async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user)
      return res.status(UNAUTHORIZED).json({ message: 'USER_NOT_AUTHENTICATED' })

    const query: string = 'DELETE FROM UserExperience WHERE userId = ?'

    const data: Query = connection.query(query, req.user._id)

    if (!data)
      return res.status(INTERNAL_SERVER_ERROR).json({ message: 'INTERNAL_SERVER_ERROR' })
  
    return res.status(NO_CONTENT).json(data)
  }
)