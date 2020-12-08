const express = require("express");
const cors = require("cors");
const {
  userSignUpSchema,
  userSignInSchema,
  taskPostSchema,
} = require("./schemas");
const {
  usersRepository,
  sessionsRepository,
  tasksRepository,
} = require("./repositories");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/users/sign-up", (req, res) => {
  const { body } = req;

  if (userSignUpSchema.validate(body).error) {
    return res.sendStatus(422);
  }

  usersRepository.create(body.name, body.email, body.password);

  res.sendStatus(201);
});

app.post("/api/users/sign-in", (req, res) => {
  const { body } = req;

  if (userSignInSchema.validate(body).error) {
    return res.sendStatus(422);
  }

  const user = usersRepository.findByEmailAndPassword(
    body.email,
    body.password
  );
  if (!user) {
    return res.sendStatus(401);
  }

  const session = sessionsRepository.create(user.id);
  res.status(200).json(session);
});

app.post("/api/tasks", (req, res) => {
  /**
   * INÍCIO AUTENTICAÇÃO
   **/

  const { authorization } = req.headers;

  if (!authorization) {
    return res.sendStatus(403);
  }

  const token = authorization.replace("Bearer ", "");
  const session = sessionsRepository.findByToken(token);

  if (!session) {
    return res.sendStatus(403);
  }

  const userId = session.userId;
  const user = usersRepository.findById(userId);

  if (!user) {
    return res.sendStatus(403);
  }

  /**
   * FIM AUTENTICAÇÃO
   **/

  if (taskPostSchema.validate(req.body).error) {
    return res.sendStatus(422);
  }

  const task = tasksRepository.create(req.body.description, user.id);
  res.sendStatus(201);
});

app.get("/api/tasks", (req, res) => {
  /**
   * INÍCIO AUTENTICAÇÃO
   **/

  const { authorization } = req.headers;

  if (!authorization) {
    return res.sendStatus(403);
  }

  const token = authorization.replace("Bearer ", "");
  const session = sessionsRepository.findByToken(token);

  if (!session) {
    return res.sendStatus(403);
  }

  const userId = session.userId;
  const user = usersRepository.findById(userId);

  if (!user) {
    return res.sendStatus(403);
  }

  /**
   * FIM AUTENTICAÇÃO
   **/

  const userTasks = tasksRepository.findAllByUserId(user.id);
  res.send(userTasks);
});

module.exports = app;
