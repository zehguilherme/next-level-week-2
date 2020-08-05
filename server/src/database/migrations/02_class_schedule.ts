// eslint-disable-next-line no-unused-vars
import Knex from "knex";

// Quais alterações serão realizadas no banco
export async function up(knex: Knex) {
  return knex.schema.createTable("class_schedule", (table) => {
    table.increments("id").primary();

    table.integer("week_day").notNullable();
    table.integer("from").notNullable(); // qual hora começa a atender
    table.integer("to").notNullable(); // até qual hora a pessoa atende

    table
      .integer("class_id")
      .notNullable()
      .references("id")
      .inTable("classes")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
}

// Deu algo de errado -> voltar atrás
export async function down(knex: Knex) {
  return knex.schema.dropTable("class_schedule");
}
