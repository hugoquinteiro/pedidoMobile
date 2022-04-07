const db = require('./db2')

var insup = async function insertuPDATE(reg){
    
    arr = []

    for (let i = 0; i < reg.length; i++) {
        let testa = await db.query(`SELECT COUNT(1) as conta FROM (
                                    SELECT 1 AS conta FROM cliente WHERE codparc = ${reg[i][0]}
                                    UNION ALL
                                    SELECT 1 AS conta FROM cliente WHERE codparc = ${reg[i][0]} AND nomeparc = '${reg[i][1]}' AND RAZAOSOCIAL = '${reg[i][2]}' AND CODVEND = ${reg[i][4]} AND CODTAB =${reg[i][5]} AND TIPNEG =${reg[i][6]} AND CODEMP =${reg[i][7]}
                                    )TEMP
                                 `);
        if (testa.rows[0].conta<2){
            if (testa.rows[0].conta==1){
                sql = `UPDATE cliente SET nomeparc = '${reg[i][1]}', RAZAOSOCIAL = '${reg[i][2]}', CODVEND = ${reg[i][4]}, CODTAB =${reg[i][5]}, TIPNEG =${reg[i][6]}, CODEMP =${reg[i][7]} WHERE codparc = ${reg[i][0]};`      
                ins = await db.query(sql);
                if (ins.rowCount===1) {
                     arr.push({codparc:reg[i][0], nomeparc:reg[i][1]})
                }
            } else {
                let sql = `INSERT INTO cliente (codparc, nomeparc, razaosocial, cgc_cpf, codvend, codtab, tipneg, codemp)
                            VALUES (${reg[i][0]},'${reg[i][1]}','${reg[i][2]}', '${reg[i][3]}', ${reg[i][4]}, ${reg[i][5]}, ${reg[i][6]}, ${reg[i][7]})`;
        
                let ins = await db.query(sql);
                if (ins.rowCount===1){
                    arr.push({codparc:reg[i][0], nomeparc:reg[i][1]})
                }
            }
        }
    }
    return arr
}


module.exports = insup