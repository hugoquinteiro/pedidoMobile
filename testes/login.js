//api = require('./axiosapi')

const axios = require('axios')


const api = axios.create({
  baseURL: "http://192.168.1.56:8280/mge/service.sbr?serviceName=MobileLoginSP.login&outputType=json",
});


const options = 
     {
     "serviceName": "MobileLoginSP.login",
        "requestBody": {
             "NOMUSU": {
                 "$": "HUGO"
             },
             "INTERNO":{
                "$":"@Matrix12"
             },
            "KEEPCONNECTED": {
                "$": "S"
            }
        }
    }
    

const dados = {
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
               "$":"06/12/2021"
            },
            "CODTIPOPER":{
               "$":"3110"
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
                     "$":"201"
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


async function login (req) {

  try{
    const {data} = await api.post(null, options);

    var dados = data;
    //console.log('data', data)
    var jsessionid  = dados.responseBody.jsessionid.$;
    //console.log ('jsessionid -->', jsessionid)
    return jsessionid
  } catch(error) {
    console.log(error)
  }    
}

console.log('Inicio...')
//var jsId = async ()=>{await getapi(options)} 
// var jsId = async function (){
//    var dados = await getapi(options) 
//    return dados
// }  
login(options).then((res) => {
    //console.log(res)
    var jsId = res
    console.log('ID:', jsId)
    const urlPed = axios.create({
      baseURL: `http://192.168.1.56:8280/mgecom/service.sbr?serviceName=CACSP.incluirNota&mgeSession=`+jsId+`&outputType=json`,
    });

async function incluirPed (req) {

  try{
    const {data} = await urlPed.post(null, dados);
    var dados = data;
    console.log('data', data)
  } catch(error) {
    console.log(error)
  }    
}    

console.log('Incluir Pedido')
incluirPed();

})

