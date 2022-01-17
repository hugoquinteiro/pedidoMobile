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
    

async function login (req) {

  try{
    const {data} = await api.post(null, options);

    var dados = data;
    console.log('data', data)
    var jsessionid  = dados.responseBody.jsessionid.$;
    //console.log ('jsessionid -->', jsessionid)
    return jsessionid
  } catch(error) {
    console.log(error)
  }    
}

console.log('Inicio...')
login(options).then((res) => {
    //console.log(res)
    var jsId = res
    console.log('ID:', jsId)


var axios = require('axios');
//var data = '{serviceName: "DbExplorerSP.executeQuery", requestBody: {sql: "SELECT codvend, apelido FROM tgfven WHERE codvend IN (7, 120, 122)"}}';

var data ={serviceName: "DbExplorerSP.executeQuery", requestBody: {sql: "SELECT codvend, apelido FROM tgfven WHERE codvend IN (7, 120, 122)"
    }
}

var config = {
  method: 'get',
  url: 'http://192.168.1.56:8280/mge/service.sbr?serviceName=DbExplorerSP.executeQuery&application=DbExplorer&outputType=json',
  headers: { 
    'Content-Type': 'application/json', 
    'Cookie': `JSESSIONID=${jsId}`
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(response.data.responseBody.rows);
})
.catch(function (error) {
  console.log(error);
});



})

