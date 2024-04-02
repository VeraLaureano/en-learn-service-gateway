export const queryUserTable: string = `
CREATE TABLE IF NOT EXISTS UserExperience (
    userId VARCHAR(255) PRIMARY KEY,
    experience INT
);
`;

export const queryWordsTable: string = `
CREATE TABLE IF NOT EXISTS UserWords (
  wordId VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255),
  FOREIGN KEY (userId) REFERENCES UserExperience(userId)
);
`;