/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-unused-vars */
import { Request, Response } from "express";
import db from "../database/connection";

export default class ConnectionsController {
  async index(request: Request, response: Response) {
    const totalConnections = await db("connections").count("* as total"); // retorna apenas um registro

    // Todas as instruções do knex ele pensa que podem retornar vários registros
    // Só pegar a 1ª posição do array
    const { total } = totalConnections[0];

    return response.json({ total });
  }

  async create(request: Request, response: Response) {
    const { user_id } = request.body;

    await db("connections").insert({ user_id });

    return response.status(201).send();
  }
}
