//FALTA CONFIGURAR
const db = require('./db2')
//Insert or UPDATE


var insup = async function insertuPDATE(reg){
    
    arr = []
    console.log('tam Preco Item:', reg.length)
    for (let i = 0; i < reg.length; i++) {
        let testa = await db.query(`SELECT COUNT(1) as conta FROM (
                                    SELECT 1 AS conta FROM ittabela WHERE nutab= ${reg[i][0]} AND codprod = ${reg[i][1]}
                                    UNION ALL
                                    SELECT 1 AS conta FROM ittabela WHERE nutab= ${reg[i][0]} AND codprod = ${reg[i][1]} AND vlrvenda = ${reg[i][2]}
                                    )TEMP
                                 `);
        if (testa.rows[0].conta<2){
            if (testa.rows[0].conta==1){
                sql = `UPDATE ittabela SET codprod='${reg[i][1]}', vlrvenda='${reg[i][2]}' WHERE nutab=${reg[i][0]};`      
                ins = await db.query(sql);
                if (ins.rowCount===1) {
                     arr.push({nutab:reg[i][0], codprod:reg[i][1],vlrvenda: reg[i][2]})
                }
            } else {
                let sql = `INSERT INTO ittabela (nutab, codprod, vlrvenda)
                VALUES (${reg[i][0]},${reg[i][1]},${reg[i][2]})`;
        
                let ins = await db.query(sql);
                if (ins.rowCount===1){
                    arr.push({nutab:reg[i][0], codprod:reg[i][1],vlrvenda: reg[i][2]})
                }
            }
        }
    }
    return arr
  
}


module.exports = insup