const selectFull = require('../pgsql/selectFull')

let cab = async function(idPedido){
  try{
    var query = `SELECT codparc, to_char(CURRENT_DATE, 'DD/MM/YYYY') AS dtcria, codvend, codemp FROM pedido WHERE id=${idPedido};`

    return selectFull(query)
    .then(res => {
      const pedido = {
        "serviceName":"CACSP.incluirNota",
        "requestBody":{
           "nota":{
              "cabecalho":{
                 "NUNOTA":{
                 },
                 "CODTIPOPER":{
                    "$":"3100"
                 },
                 "CODTIPVENDA":{
                    "$":"1"
                 },
                 "TIPMOV":{
                    "$":"P"
                 },
                 "CODNAT":{
                  "$":"1010101"
               }           
              },
              "itens":{
                 "INFORMARPRECO":"True",
                 "item":[
                 ]
              }
           }
        }
      }
      pedido.requestBody.nota.cabecalho.codparc = {$:`${res[0].codparc}`}
      pedido.requestBody.nota.cabecalho.codvend = {$:`${res[0].codvend}`}
      pedido.requestBody.nota.cabecalho.codemp = {$:`${res[0].codemp}`}
      pedido.requestBody.nota.cabecalho.dtneg = {$:`${res[0].dtcria}`}
      //console.log(pedido.requestBody)

      var result =  pedido
      return result
    })
    .catch(err => console.log('Query gerou erro:',err))
 
  }catch(err){ 
    console.log('Erro objPedido:', err)

  }
}

let objPedido = async function(idPedido){
  var queryIT = `SELECT codprod, quantidade, vlrvenda FROM itpedido WHERE id=${idPedido};`
  return selectFull(queryIT)
    .then( async resItens => {
      let pedido = await cab(idPedido)
      //console.log(pedido.requestBody)
      resItens.forEach(el => {
        var objItem = {}
        objItem.NUNOTA = {}
        objItem.CODPROD = {$:`${el.codprod}`}
        objItem.QTDNEG = {$:`${el.quantidade}`}
        objItem.CODLOCALORIG = {$:'2'}
        objItem.VLRUNIT = {$:`${el.vlrvenda}`}
        objItem.PERCDESC = {$:'0'}
        objItem.CODVOL = {$:'UN'}
        pedido.requestBody.nota.itens.item.push(objItem)
      })
      //console.log(pedido.requestBody)
      //console.log(pedido.requestBody.nota)
      return pedido

    })
    .catch(err => console.log(err))      
}

//objPedido('15')
module.exports = objPedido


/*
*/