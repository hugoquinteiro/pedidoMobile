const db = require('./db2')


//INSERT

var insere = async function insertCustomer(cab, itens){
  let sql = 'INSERT INTO pedido (idlogin, dtcria, codvend, codparc, codemp, statusped) VALUES ($1, $2, $3, $4, $5, $6);';
  let values = [cab.idlogin,cab.dtcria, cab.codvend, cab.codparc, cab.codemp];
  values.push("PED")
  let ins = await db.query(sql, values);

  //console.log(ins.rowCount)
  //Aqui preciso verificar qual foi o ID gerado no pedido para gravar os itens
  if (ins.rowCount===1){
    //console.log(`${cab.dtcria.toISOString()}`) // console.log(yourDate.toISOString())
    const res = await db.query(`SELECT max(id) as id FROM pedido WHERE idlogin= '${cab.idlogin}'`);
    //console.log(res.rows[0].id)
    if(res.rows[0].id){
     
     sql = 'INSERT INTO itpedido (id, codprod, quantidade, vlrvenda) VALUES ($1, $2, $3, $4);';
     
     //console.log(itens)
     //let listaItens = Object.values(itens)
     
     itens.forEach(async element => {
      //console.log(element)  
      values = [res.rows[0].id, element[0], element[2],element[3]]
      ins = await db.query(sql, values, (err, res)=>{
        if(err) {console.log(err)} 
        //client.release()
      });
      });
     
    }

    var newId = res.rows
    //client.release(true) //Aqui ele fecha a conexão pra liberar um novo usuário
  }
  
  return newId
}



module.exports = insere


//busca().then(x => console.log(x))
//Mais simples
//listar().then(x => console.log(x))


/* Deu Certo
	listar().then(x => x.map(a => a.nome))
		.then(nome => console.log(nome))
*/
		
