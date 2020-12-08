const supertest = require("supertest");
const app = require("../src/app");

let request;
let server;

beforeEach(() => {
  server = app.listen();
  request = supertest.agent(server);
});

afterEach(() => {
  server.close();
});

describe("POST /api/users/sign-up", () => {
  it("should create user if data is valid", async () => {
    const body = {
      name: "Fulano de Tal",
      email: "fulano@detal.com.br",
      password: "senhasegura",
    };

    const response = await request.post("/api/users/sign-up").send(body);

    expect(response.status).toBe(201);
  });

  it("should not create user if data is invalid", async () => {
    const body = {
      name: "Fulano de Tal",
      email: "fulano",
      password: "senhasegura",
    };

    const response = await request.post("/api/users/sign-up").send(body);

    expect(response.status).toBe(422);
  });
});

describe("POST /api/users/sign-in", () => {
  it("should return sessions if given data is valid and user exists", async () => {
    const bodySignUp = {
      name: "Fulano de Tal",
      email: "fulano@detal.com.br",
      password: "senhasegura",
    };
    await request.post("/api/users/sign-up").send(bodySignUp);

    const body = {
      email: bodySignUp.email,
      password: bodySignUp.password,
    };

    const response = await request.post("/api/users/sign-in").send(body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("userId");
  });

  it("should return 401 if user is not found", async () => {
    const body = {
      email: "fulano2@detal.com.br",
      password: "senhasegura",
    };

    const response = await request.post("/api/users/sign-in").send(body);

    expect(response.status).toBe(401);
  });
});

describe("POST /api/tasks", () => {
  it("should not create a task if user is not logged in and return status 403", async () => {
    const body = {
      description: "My super task",
    };

    const response = await request.post("/api/tasks").send(body);

    expect(response.status).toBe(403);
  });

  it("should not create a task if data is invalid and return status 422", async () => {
    const body = {
      userId: "My super task",
    };

    const token = await getValidToken();
    const response = await request
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send(body);

    expect(response.status).toBe(422);
  });

  it("should create a task if data is valid and user is logged in", async () => {
    const body = {
      description: "My super task",
    };

    const token = await getValidToken();
    const response = await request
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send(body);

    expect(response.status).toBe(201);
  });
});

describe("GET /api/tasks", () => {
  it("should not return task if user is not logged in", async () => {
    const response = await request.get("/api/tasks");

    expect(response.status).toBe(403);
  });

  it("should return tasks if user is logged in", async () => {
    const token = await getValidToken();
    await createTask(token, "SUPER TASK");
    await createTask(token, "My super task");

    const response = await request
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });
});

async function getValidToken() {
  const bodySignUp = {
    name: "Fulano de Tal",
    email: "fulano@detal.com.br",
    password: "senhasegura",
  };
  await request.post("/api/users/sign-up").send(bodySignUp);

  const body = {
    email: bodySignUp.email,
    password: bodySignUp.password,
  };

  const response = await request.post("/api/users/sign-in").send(body);
  return response.body.token;
}

function createTask(token, description) {
  return request
    .post("/api/tasks")
    .set("Authorization", `Bearer ${token}`)
    .send({ description });
}
