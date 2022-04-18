var axios = require('axios');
var login = require('./loginapi')
const server = require('./server')

const url = `http://${server.name}/mge/service.sbr?serviceName=CRUDServiceProvider.saveRecord&outputType=json`
//`http://${server.name}/mge/service.sbr?serviceName=DbExplorerSP.executeQuery&application=DbExplorer&outputType=json`

var consulta = async function(){
    return login().then( async (res) => {
        //console.log(res)
        var jsId = await res

        var data ={  "serviceName":"CRUDServiceProvider.saveRecord",
        "requestBody":{
           "dataSet":{
              "rootEntity":"Parceiro",
              "includePresentationFields":"S",
              "dataRow":{
                 "localFields":{
                    "TIPPESSOA":{
                       "$":"F"
                    },               
                    "NOMEPARC":{
                       "$":"HUGION"
                    },               
                    "CGC_CPF":{
                        "$":"48877461055"
                     },               
                    "CODCID":{
                       "$":"10"
                    },               
                    "ATIVO":{
                       "$":"S"
                    },
                     "CLIENTE":{
                         "$":"S"
                     },
                     "CODVEND":{
                        "$":"7"
                    },
                    "CODTIPPARC":{
                        "$":"403001"
                    },
                    "CODEMPPREF":{
                        "$":"12"
                    },                                                             
                     "CLASSIFICMS":{
                         "$":"C"
                     }
                 }
              }, "entity":{
                 "fieldset":{
                    "list":"CODPARC,TIPPESSOA,NOMEPARC,CGC_CPF,CODCID,ATIVO,CLIENTE,CODVEND,CODTIPPARC,CODEMPPREF, CLASSIFICMS"
                 }
              }
           }
        }
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
    
//    return await config
    
  return axios(config)
    .then(async function (response) {
      //console.log(response.data.responseBody.rows);
      return await response.data.responseBody.entities.entity.CODPARC.$
    })
    .catch(function (error) {
      console.log(error);
      return []
    });
    
    })
    
}



//module.exports =  consulta

consulta().then( res => console.log(res))