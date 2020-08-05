// eslint-disable-next-line no-unused-vars
import Knex from "knex";

// Quais alterações serão realizadas no banco
export async function up(knex: Knex) {
  return knex.schema.createTable("classes", (table) => {
    table.increments("id").primary();
    table.string("subject").notNullable();
    table.string("cost").notNullable();

    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE") // o que acontecerá com o 'id' da tabela 'classes' se ele for alterado na tabela 'users'
      .onDelete("CASCADE"); // o que acontecerá com as aulas de um prof caso ele seja deletado
    // CASCADE: deletará todas as aulas do prof
  });
}

// Deu algo de errado -> voltar atrás
export async function down(knex: Knex) {
  return knex.schema.dropTable("classes");
}
