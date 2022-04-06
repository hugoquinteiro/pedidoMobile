const db = require('./db2')
//Insert or UPDATE

var insup = async function insertuPDATE(produto){
    
    //console.log('Teste: ', testa.rows[0].conta, 'SQL:',`SELECT COUNT(codprod) as conta  FROM produto WHERE codprod = ${produto[0]}`)
    arr = []
    console.log('tam:', produto.length)
    for (let i = 0; i < produto.length; i++) {
        let testa = await db.query(`SELECT COUNT(CONTA) as conta FROM (
                                    SELECT 1 as conta  FROM produto WHERE codprod = ${produto[i][0]}
                                    UNION ALL
                                    SELECT 1 as conta  FROM produto WHERE codprod = ${produto[i][0]} AND descrprod='${produto[i][1]}' AND MARCA='${produto[i][2]}' AND REFERENCIA='${produto[i][3]}' AND CODBARRA='${produto[i][4]}'
                                    ) TEMP;
            `);
        //console.log(produto)
        if (testa.rows[0].conta<2){
            if (testa.rows[0].conta==1){
                sql = `UPDATE produto SET descrprod='${produto[i][1]}', marca='${produto[i][2]}', referencia='${produto[i][3]}', codbarra='${produto[i][4]}'  WHERE codprod=${produto[i][0]};`      
                ins = await db.query(sql);
                if (ins.rowCount===1) {
                     arr.push({codprod:produto[i][0], descrprod:produto[i][1],marca: produto[i][2], referencia:produto[i][3]})
                }
            } else {
                let sql = `INSERT INTO produto (codprod, descrprod, marca, referencia, codbarra )
                VALUES (${produto[i][0]},'${produto[i][1]}', '${produto[i][2]}', '${produto[i][3]}', '${produto[i][4]}')`;
        
                let ins = await db.query(sql);
                if (ins.rowCount===1){
                    arr.push({codprod:produto[i][0], descrprod:produto[i][1],marca: produto[i][2], referencia:produto[i][3]})
                }
            }
        }
    
    }
    return arr
  
}


module.exports = insup