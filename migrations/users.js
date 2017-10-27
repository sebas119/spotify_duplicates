'use strict';
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('idUserSpotify')
      table.string('name');      
      table.string('emailAddress');
      table.string('linkUserSpotify');
      table.timestamp('created_at').defaultTo(knex.fn.now());      
    });
};
exports.down = function(knex) {
  return knex.schema
    .dropTable('users');
};
