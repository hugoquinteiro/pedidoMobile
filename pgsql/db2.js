/**
 * Arquivo: config/database.js
 * Descrição: arquivo responsável pelas 'connectionStrings da aplicação: PostgreSQL.
 * Data: 04/03/2020
 * Author: Glaucia Lemos
 */

 const { Pool } = require('pg');

 // ==> Conexão com a Base de Dados:
 const pool = new Pool({
   connectionString: 'postgres://postgres:postgres@localhost:5432/uhgo'
   //connectionString: 'postgres://postgres:postgres@localhost:5432/estudo'
   ,max:1
 });
 
 pool.on('connect', () => {
   console.log('Base de Dados conectado com sucesso!');
 });
 
 module.exports = {
   query: (text, params) => pool.query(text, params),
 };