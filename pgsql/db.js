// const pg = require ('pg')

// const client = new pg.Client({
// 	database:'estudo',
// 	user:'postgres',
// 	password:'postgres',
// 	host:'localhost',
// 	port:'5432'
// })


const client = async function connect() {
  if (global.connection)
      return global.connection.connect();

  const { Pool } = require('pg');
  const pool = new Pool({
      //connectionString: 'postgres://postgres:postgres@localhost:5432/uhgo',
      connectionString: 'postgres://postgres:postgres@localhost:5432/estudo',
      max:2, //Funcionou, após X conexões ele trava **Falta encontrar solução para fechar conexão
      //connectionTimeoutMillis: 1000
  });
  
  //apenas testando a conexão
  const client = await pool.connect();
  console.log("Criou pool de conexões no PostgreSQL!");

  const res = await client.query('SELECT NOW()');
  console.log(res.rows[0]);
  client.release();

  //guardando para usar sempre o mesmo
  global.connection = pool;
  return pool.connect();
}

module.exports =  client