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
    


async function login () {

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

console.log('Login...')
var session = login()
//session.then((res) => console.log(res) )

module.exports = session
