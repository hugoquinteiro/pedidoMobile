var axios = require('axios');
var login = require('./loginapi')
const server = require('./server')

const url = `http://${server.name}/mge/service.sbr?serviceName=DbExplorerSP.executeQuery&application=DbExplorer&outputType=json`

var precos =  async function(){
   return login().then( async (res) => {
    var jsId = await res
    //console.log('ID:', jsId)
  var data ={serviceName: "DbExplorerSP.executeQuery", 
            requestBody: {sql: `SELECT CODPROD, DESCRPROD, MARCA, REFERENCIA, (SELECT CODBARRA FROM TGFBAR WHERE CODPROD=TGFPRO.CODPROD) AS CODBARRA 
                                FROM TGFPRO WHERE CODPROD IN (
                                  SELECT distinct codprod FROM tgfexc WHERE nutab IN (
                                  (SELECT nutab FROM TGFTAB TAB WHERE codtab IN (SELECT DISTINCT codtab FROM tgfpar WHERE codvend IN (SELECT codvend FROM tgfven WHERE AD_ENVIAMOBILE='S')) AND dtvigor=(SELECT MAX(dtvigor) FROM tgftab WHERE codtab=tab.codtab))
                                  )
                                ) AND ATIVO='S' AND AD_ION_ENVIA='S'
                              `
      }
  }//AND exc.codprod IN (7,8,10,11, 30,31,32,148,1021)

  var config = {
    method: 'get',
    url: url,
    headers: { 
      'Content-Type': 'application/json', 
      'Cookie': `JSESSIONID=${jsId}`
    },
    data : data
  }


return axios(config)
.then(async function (response) {
  //console.log(response.data.responseBody.rows);
  return  response.data.responseBody.rows
})
.catch(function (error) {
  console.log(error);
});


   //return await config

})

}

  
module.exports =  precos