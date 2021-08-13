const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();
app.use(express.json());

// Variables
const repositories = [];

//Middlewares
function validateRepositorie(request, response, next) {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id)

  if(!repository) {
    return response.status(404).json({error: "ID not found"})
  }

  request.id = id;
  return next();
}

// Routes
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.status(201).json(repository);
});

app.put("/repositories/:id", validateRepositorie, (request, response) => {
  const { id } = request;
  const { url, title, techs } = request.body;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const repository = { ...repositories[repositoryIndex], url, title, techs};

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateRepositorie, (request, response) => {
  const { id } = request;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex === -1) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositorie, (request, response) => {
  const { id } = request;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json({likes: likes});
});

module.exports = app;
