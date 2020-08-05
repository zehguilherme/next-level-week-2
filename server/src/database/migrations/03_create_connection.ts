// eslint-disable-next-line no-unused-vars
import Knex from "knex";

/**
 * Armazenará a informação - se o aluno tentou entrar em contato com o professor
 */

// Quais alterações serão realizadas no banco
export async function up(knex: Knex) {
  return knex.schema.createTable("connections", (table) => {
    table.increments("id").primary();

    table
      .integer("user_id") // houve uma conexão com determinado professor
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");

    // quando houve a conexão de aluno com determinado professor
    // now() - pega o horário atual e salva no campo 'create_at'
    table
      .timestamp("create_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"))
      .notNullable();
  });
}

// Deu algo de errado -> voltar atrás
export async function down(knex: Knex) {
  return knex.schema.dropTable("connections");
}
