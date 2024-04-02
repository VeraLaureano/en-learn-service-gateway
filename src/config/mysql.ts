import mysql from 'mysql'
import { DATABASE, HOST, PASSWORD, USER } from './env';

const connection: mysql.Connection = mysql.createConnection({
  host: HOST, 
  user: USER, 
  password: PASSWORD, 
  database: DATABASE 
})

export default connection