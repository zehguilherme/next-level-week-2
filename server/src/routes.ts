/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import express from "express";

import ClassesController from "./controllers/ClassesController";
import ConnectionsController from "./controllers/ConnectionsController";

const routes = express.Router();

const classesControllers = new ClassesController();
const connectionsControllers = new ConnectionsController();

// AULAS
routes.post("/classes", classesControllers.create); // Criação
routes.get("/classes", classesControllers.index); // Listar todas

// CONNECTIONS
routes.post("/connections", connectionsControllers.create); // Criação
routes.get("/connections", connectionsControllers.index); // Listar todas

export default routes;
