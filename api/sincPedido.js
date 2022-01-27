var sincPedido = require('./objPedido')
var enviaPedido = require('./gerarPedido')

const sinc = async function(idPedido) {
  var objPedido = await sincPedido(idPedido)
  console.log('Prepara Pedido',objPedido.requestBody.nota)
  return enviaPedido(objPedido)
  .then(result => {
    //console.log('Resultado Pedido', result)
    return result
  })
};

module.exports = sinc
//console.log(temp())
