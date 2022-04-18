var sincCliente = require('./objCliente')
var enviaCliente = require('./insereCliente')

const sinc = async function(idCliente) {
  var obj = await sincCliente(idCliente)
  //console.log('Prepara Pedido',objPedido.requestBody.nota)
  return enviaCliente(obj)
  .then(result => {
    //console.log('Resultado Pedido', result)
    return result
  })
};

sinc(1).then( x => console.log('Qualquer retorno', x))
//module.exports = sinc
//console.log(temp())
