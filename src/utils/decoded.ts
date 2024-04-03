import { verify } from 'jsonwebtoken';

// Import the 'SECRET_KEY' constant from the '../config/env' module
import { SECRET_KEY } from '../config/env';

// Function that decodes a JSON Web Token (JWT)
export const decoded = (token: string): { userID: string } => {
  // Verify the token using the 'jsonwebtoken' module and the 'SECRET_KEY'
  const data = verify(token, SECRET_KEY as string);
  return Object(data);
};