/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from "express";

import db from "../database/connection";

import convertHourToMinutes from "../utils/convertHourToMinutes";

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class ClassesController {
  async index(request: Request, response: Response) {
    const filters = request.query;

    const subject = filters.subject as string;
    const week_day = filters.week_day as string;
    const time = filters.time as string;

    // Se usuário não informou dia da semana
    // Ou não informou a matéria
    // Ou não informou o horário da aula
    if (!filters.week_day || !filters.subject || !filters.time) {
      return response
        .status(400)
        .json({ error: "Missing filters to search classes" });
    }

    const timeInMinutes = convertHourToMinutes(time);

    const classes = await db("classes")
      /** Verifica se existe algum registro na tabela 'class_schedule'
       * em que o id dela, comparado ao id vindo da classe
       * trabalhe no dia da semana que está vindo do filtro
       */
      .whereExists(function () {
        this.select("class_schedule.*")
          .from("class_schedule")
          .whereRaw("`class_schedule`.`class_id` = `classes`.`id`")
          .whereRaw("`class_schedule`.`week_day` = ??", [Number(week_day)])
          .whereRaw("`class_schedule`.`from` <= ??", [timeInMinutes]) // hora de trabalho antes ou no mesmo horário ao horário que o aluno quer ter aula
          .whereRaw("`class_schedule`.`to` > ??", [timeInMinutes]); // hora de parar de trabalhar deve se maior que a hora que o aluno quer marcar
      })
      .where("classes.subject", "=", subject)
      .join("users", "classes.user_id", "=", "users.id")
      .select(["classes.*", "users.*"]);

    response.json(classes);
  }

  async create(request: Request, response: Response) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule,
    } = request.body;

    // transaction - Realiza todas as operações do banco ao mesmo tempo
    // Caso uma der falha, são desfeitas todas as que já foram feitas anteriormente naquele mesmo contexto
    const trx = await db.transaction();

    try {
      const insertedUsersIds = await trx("users").insert({
        name,
        avatar,
        whatsapp,
        bio,
      });

      const user_id = insertedUsersIds[0];

      const insertedClassesIds = await trx("classes").insert({
        subject,
        cost,
        user_id,
      });

      const class_id = insertedClassesIds[0];

      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => ({
        class_id,
        week_day: scheduleItem.week_day,
        from: convertHourToMinutes(scheduleItem.from),
        to: convertHourToMinutes(scheduleItem.to),
      }));

      await trx("class_schedule").insert(classSchedule);

      // É somente nesse momento que são realizadas as operações no banco
      await trx.commit();

      return response.status(201).send();
    } catch (error) {
      await trx.rollback(); // desfaz as alterações no banco

      return response
        .status(400)
        .json({ error: "Unexpected error while creating new class" });
    }
  }
}
