const axios = require('axios');
const login = require('./loginapi');

const api = axios.create({
  baseURL: "http://192.168.1.56:8280/mge/service.sbr?serviceName=MobileLoginSP.login&outputType=json",
});

//console.log('Ini...')
//console.log(api)


const options = 
     {
     "serviceName": "MobileLoginSP.login",
        "requestBody": {
             "NOMUSU": {
                 "$": "IONADMIN"
             },
             "INTERNO":{
                "$":"MQ@2221"
             }
        }
    }

    
var conn = async function login () {

  try{
    const {data} = await api.post(null, options);

    var dados = data;
    console.log('Login (conn.js)', data)
    var jsessionid  = dados.responseBody.jsessionid.$;
    return jsessionid
  } catch(error) {
    console.log(error)
  }    
} 

//conn()

module.exports = conn
