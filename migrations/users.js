'use strict';
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id').primary();
      table.string('idUserSpotify');
      table.string('displayName');      
      table.string('emailAddress');
      table.string('spotifyUri');
      table.string('linkUserSpotify');
      table.string('profileImageLink');
      table.timestamp('created_at').defaultTo(knex.fn.now());      
      table.timestamp("last_entry").defaultTo(knex.fn.now());      
    });
};
exports.down = function(knex) {
  return knex.schema
    .dropTable('users');
};
