import { logError, logInfo } from "../utils/loggers";
import { queryUserTable, queryWordsTable } from "../utils/tablesQuerys";
import connection from "./mysql";

export const createUserTable = () => {
  connection.query(queryUserTable, (err) => {
    if (err) {
      logError(err)
    } else {
      logInfo('Created UserExperience table')
    }
  });
};

export const createWordsTable = () => {
  connection.query(queryWordsTable, (err) => {
    if (err) {
      logError(err)
    } else {
      logInfo('Created UserWords table')
    }
  });
};