var axios = require('axios');
var login = require('./loginapi')
const server = require('./server')

const url = `http://${server.name}/mge/service.sbr?serviceName=DbExplorerSP.executeQuery&application=DbExplorer&outputType=json`

var precos =  async function(query){
   return login().then( async (res) => {
    var jsId = await res
    //console.log('ID:', jsId)
  var data ={serviceName: "DbExplorerSP.executeQuery", 
            requestBody: {sql: query }
  }

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