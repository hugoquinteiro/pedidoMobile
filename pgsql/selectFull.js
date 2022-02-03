const connect = require('./db')

 var busca = async function selectCustomers(query) {
  const client = await connect();
  const res = await client.query(`${query}`);
  console.log(query)
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
		
