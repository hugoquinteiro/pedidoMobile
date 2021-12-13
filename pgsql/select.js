const connect = require('./db')

 var busca = async function selectCustomers(tabela, order, where, limit) {
  const client = await connect();
  if (order){ order =  'ORDER BY ' + order}
  if (where){ where = 'WHERE ' + where} else {where = 'WHERE true'}
  if (limit){ limit = 'LIMIT ' + limit} else {limit = 'LIMIT 1000'}
  //console.log(`SELECT * FROM ${tabela} ${where} ${order} ${limit}`)
  const res = await client.query(`SELECT * FROM ${tabela} ${where} ${order} ${limit}`);
  //Testes
   // tell the pool to destroy this client
   client.release(true) //Aqui ele fecha a conexão pra liberar um novo usuário
   
  return res.rows;
  //client.end();
}

module.exports = busca


/* Deu Certo
	listar().then(x => x.map(a => a.nome))
		.then(nome => console.log(nome))
*/
		
