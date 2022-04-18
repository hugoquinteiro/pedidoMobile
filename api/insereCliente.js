const conn = require('./conn')
const axios = require('axios')

let cliente = async function(obj) {

  return conn().then(async res => {
    let jsID = res
    let URLPedido = `http://192.168.1.56:8280/mge/service.sbr?serviceName=CRUDServiceProvider.saveRecord&outputType=json`
    // `http://192.168.1.56:8280/mgecom/service.sbr?serviceName=CACSP.incluirNota&mgeSession=`+jsID+`&outputType=json`

    //Envio dos dados para inclusão do Pedido  
    return await axios.post(URLPedido, obj)
      .then(dados =>{
        //console.log('Pedido: ', dados.data)
        var retorno = {aviso: dados.data}
                        //nunota: dados.data.responseBody.avisos.pk.NUNOTA}
        console.log('Retorno*** ',retorno)
        //return retorno
      })
      .catch(err => console.log(err))
    })
    .catch(error => console.log('Erro jsID:',error)) 
}


//result().then( re => console.log(re.requestBody))


module.exports = cliente