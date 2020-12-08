const users = [];

function create(name, email, password) {
  const user = {
    id: users.length + 1,
    name,
    email,
    password,
  };

  users.push(user);
  return user;
}

function findByEmailAndPassword(email, password) {
  return users.find((u) => u.email === email && u.password === password);
}

function findAll() {
  return users;
}

function findById(id) {
  return users.find((u) => u.id == id);
}

module.exports = {
  create,
  findByEmailAndPassword,
  findAll,
  findById,
};
