const { v4: uuid } = require("uuid");

let sessions = [];

function create(userId) {
  const token = uuid();
  const session = {
    userId,
    token,
  };

  sessions.push(session);
  return session;
}

function findByToken(token) {
  return sessions.find((s) => s.token == token);
}

module.exports = {
  create,
  findByToken,
};
