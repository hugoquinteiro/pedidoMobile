//FALTA CONFIGURAR
const db = require('./db2')
//Insert or UPDATE


var insup = async function insertuPDATE(reg){
    
    arr = []
    console.log('tam Estoque:', reg.length)
    for (let i = 0; i < reg.length; i++) {
        let testa = await db.query(`SELECT COUNT(1) as conta FROM (
                                    SELECT 1 AS conta FROM estoque WHERE codemp = ${reg[i][0]} AND codprod = ${reg[i][1]}
                                    UNION ALL
                                    SELECT 1 AS conta FROM estoque WHERE codemp = ${reg[i][0]} AND codprod = ${reg[i][1]} AND reservado=${reg[i][2]} AND estoque = ${reg[i][3]}
                                    )TEMP
                                 `);
        if (testa.rows[0].conta<2){
            if (testa.rows[0].conta==1){
                sql = `UPDATE estoque SET reservado=${reg[i][2]}, estoque = ${reg[i][3]} WHERE codemp = ${reg[i][0]} AND codprod = ${reg[i][1]};`      
                ins = await db.query(sql);
                if (ins.rowCount===1) {
                     arr.push({codemp:reg[i][0], codprod:reg[i][1],reservado: reg[i][2], estoque: reg[i][2]})
                }
            } else {
                let sql = `INSERT INTO estoque  (codemp, codprod, reservado, estoque)
                VALUES (${reg[i][0]},${reg[i][1]},${reg[i][2]}, ${reg[i][3]})`;
        
                let ins = await db.query(sql);
                if (ins.rowCount===1){
                    arr.push({codemp:reg[i][0], codprod:reg[i][1],reservado: reg[i][2], estoque: reg[i][2]})
                }
            }
        }
    }
    return arr
  
}


module.exports = insup