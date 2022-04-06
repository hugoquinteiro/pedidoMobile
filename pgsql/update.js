const db = require('./db2')

var update = async function (query){

  let retornosql = await db.query(query);

  //console.log('sql', retornosql.rowCount)   
  return retornosql.rowCount
}

module.exports = update