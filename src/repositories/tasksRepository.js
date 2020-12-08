let tasks = [];

function create(description, userId) {
  const task = {
    id: tasks.length + 1,
    description,
    userId,
  };

  tasks.push(task);
  return task;
}

function findAllByUserId(userId) {
  return tasks.filter((t) => t.userId == userId);
}

module.exports = {
  create,
  findAllByUserId,
};
