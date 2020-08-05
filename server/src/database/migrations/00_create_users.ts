// eslint-disable-next-line no-unused-vars
import Knex from "knex";

// Quais alterações serão realizadas no banco
export async function up(knex: Knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("avatar").notNullable();
    table.string("whatsapp").notNullable();
    table.string("bio").notNullable();
  });
}

// Deu algo de errado -> voltar atrás
export async function down(knex: Knex) {
  return knex.schema.dropTable("users");
}
