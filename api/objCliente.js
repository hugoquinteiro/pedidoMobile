const selectFull = require('../pgsql/selectFull')

let cad = async function(idPedido){
  try{
    var query = `SELECT codparc FROM cliente WHERE codparc = -1;`

    return selectFull(query)
    .then(res => {
      const cliente = {  "serviceName":"CRUDServiceProvider.saveRecord",
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
                     "$":"JON SNOW"
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
                   "CLASSIFICMS":{
                       "$":"C"
                   }
               }
            }, "entity":{
               "fieldset":{
                  "list":"CODPARC,TIPPESSOA,NOMEPARC,CODCID,ATIVO,CLIENTE,CLASSIFICMS"
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
    data : cliente
  }

    //   pedido.requestBody.nota.cabecalho.codparc = {$:`${res[0].codparc}`}
    //   pedido.requestBody.nota.cabecalho.codvend = {$:`${res[0].codvend}`}
    //   pedido.requestBody.nota.cabecalho.codemp = {$:`${res[0].codemp}`}
    //   pedido.requestBody.nota.cabecalho.dtneg = {$:`${res[0].dtcria}`}
      //console.log(pedido.requestBody)

      var result =  cliente
      return result
    })
    .catch(err => console.log('Query gerou erro:',err))
 
  }catch(err){ 
    console.log('Erro:', err)

  }
}


//objPedido('15')
module.exports = cad


/*
*/