const db = require('./db2')



var insere = async function insertCliente(ObjDados){
    console.log(ObjDados)

  let sql = `INSERT INTO cliente (
                            codparc
                            ,nomeparc
                            ,razaosocial
                            ,cgc_cpf
                            ,codvend
                            ,ie
                            ,cep
                            ,tipoender
                            ,endereco
                            ,numero
                            ,complemento)
             VALUES 
             (-1
             ,'${ObjDados.nomeparc}'
             ,'${ObjDados.razaosocial}'
             ,'${ObjDados.cnpj}'
             ,${ObjDados.codvend}
             ,'${ObjDados.ie}'
             ,'${ObjDados.cep}'
             ,'${ObjDados.tipoender}'
             ,'${ObjDados.endereco}'
             ,${ObjDados.numero}
             ,'${ObjDados.complemento}'
             );`;

             let ins = await db.query(sql);

  if (ins.rowCount===1){
    return true
  }
  
  return false
}



module.exports = insere


/* Deu Certo
	listar().then(x => x.map(a => a.nome))
		.then(nome => console.log(nome))
*/
		
