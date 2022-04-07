const db = require('./db2')
//Insert or UPDATE

var insup = async function insertuPDATE(reg){
    
    arr = []
    console.log('tam Tabela:', reg.length)
    for (let i = 0; i < reg.length; i++) {
        let testa = await db.query(`SELECT COUNT(1) as conta FROM (
                                    SELECT 1 AS conta FROM TABELA WHERE NUTAB=${reg[i][0]}
                                    UNION ALL
                                    SELECT 1 AS CONTA FROM TABELA WHERE NUTAB=${reg[i][0]} AND CODTAB=${reg[i][1]} AND DTVIGOR='${reg[i][2]}' AND CODTABORIG=${reg[i][3]} AND percentual=${reg[i][4]}
                                    )TEMP;
                                 `);
        if (testa.rows[0].conta<2){
            if (testa.rows[0].conta==1){
                sql = `UPDATE tabela SET codtab='${reg[i][1]}', dtvigor='${reg[i][2]}', codtaborig='${reg[i][3]}', percentual=${reg[i][4]}  WHERE codtab=${reg[i][0]};`      
                ins = await db.query(sql);
                if (ins.rowCount===1) {
                     arr.push({nutab:reg[i][0], codtab:reg[i][1],dtvigor: reg[i][2], codtaborig:reg[i][3], perc:reg[i][4]})
                }
            } else {
                let sql = `INSERT INTO tabela (nutab, codtab, dtvigor, codtaborig,percentual)
                VALUES (${reg[i][0]},${reg[i][1]}, '${reg[i][2]}', ${reg[i][3]}, ${reg[i][4]})`;
        
                let ins = await db.query(sql);
                if (ins.rowCount===1){
                    arr.push({nutab:reg[i][0], codtab:reg[i][1],dtvigor: reg[i][2], codtaborig:reg[i][3], perc:reg[i][4]})
                }
            }
        }
    
    }
    return arr
  
}


module.exports = insup