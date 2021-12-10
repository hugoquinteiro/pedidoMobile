var login = require('./login')
const axios = require('./axios')


const order = {
   "serviceName":"CACSP.incluirNota",
   "requestBody":{
      "nota":{
         "cabecalho":{
            "NUNOTA":{
            },
            "CODPARC":{
               "$":"9999"
            },
            "DTNEG":{
               "$":"09/12/2021"
            },
            "CODTIPOPER":{
               "$":"3100"
            },
            "CODTIPVENDA":{
               "$":"1"
            },
            "CODVEND":{
               "$":"7"
            },
            "CODEMP":{
               "$":"12"
            },
            "CODNAT":{
               "$":"1010101"
            },            
            "TIPMOV":{
               "$":"P"
            }
         },
         "itens":{
            "INFORMARPRECO":"True",
            "item":[
                  {
                   "NUNOTA":{
                  },
                  "CODPROD":{
                     "$":"147"
                  },
                  "QTDNEG":{
                     "$":"1"
                  },
                  "CODLOCALORIG":{
                     "$":"2"
                  },
                  "VLRUNIT":{
                     "$":"203"
                  },
                  "PERCDESC":{
                     "$":"0"
                  },                  
                  "CODVOL":{
                     "$":"UN"
                  }
               }               
            ]
         }
      }
   }
}


login.then((res) => {
	var session = res
	console.log ('session', session)
    

async function incluirPed (req) {

  try{
    const {data} = await axios.post(`http://192.168.1.56:8280/mgecom/service.sbr?serviceName=CACSP.incluirNota&mgeSession=${session}&outputType=json`, order);
    var dados = data;
    console.log('data', data)
  } catch(error) {
    console.log(error)
  }    
}    
//console.log('urlPed:',urlPed)
console.log('Incluir Pedido')
incluirPed();


})



