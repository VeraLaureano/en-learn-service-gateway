import app from './app'
import { createServer } from 'http'
import { logError, logInfo } from "./utils/loggers";
import { PORT } from './config/env';
import connection from './config/mysql';

const server = createServer(app);

server.keepAliveTimeout = 30000;

const start: () => void = async () => {
  try {
    connection.connect((err) => {
      if (err) {
        logError(err);
        return;
      }
      logInfo('Connected to the DataBase...');
    });

    server.listen(PORT, (): void => {
      logInfo(`Server running on port ${PORT}...`);
      logInfo(`http://localhost:${PORT}/`);
    });
  } catch (err) {
    logError(err);
  }
};

start();