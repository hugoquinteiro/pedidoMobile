console.log('Pedido Carregou')
var myModal = new bootstrap.Modal(document.getElementById('addItemModal'), {})

function loadFormItem(codprod){
  
  var item = document.getElementById('item-'+codprod).innerHTML
  var preco = document.getElementById('preco-'+codprod).innerHTML
  var estoque = document.getElementById('estoque-'+codprod).innerHTML
  var estInfo = document.getElementById('estInfo')
  var precoItem = document.getElementById('precoItem')
  
  var tittle = document.getElementById('addItemModalTittle')
  tittle.innerText = item
  estInfo.innerHTML = estoque
  precoItem.value = preco
  myModal.toggle()
}


function gravarItem(){
  console.log('Gravar Item')
  var item = document.getElementById('addItemModalTittle').textContent;
  var quantidade = document.getElementById('quantidade').value;
  var precoItem = document.getElementById('precoItem').value;

  
  //console.log(item.substring(0, item.indexOf(' -')).trim(), item.substring(item.indexOf('- ')+2))
  //Separando codigo da descrição
  var codprod = item.substring(0, item.indexOf(' -')).trim()
  var descrprod = item.substring(item.indexOf('- ')+2)

  var dadosItem = {
    codprod : codprod,
    descrprod : descrprod,
    quantidade : quantidade,
    preco:  precoItem
  }

//  atualizaTableItens(dadosItem)
  myModal.hide()

  axios.post('gravarItem', {dados: dadosItem})
  .then(resp => {
    //console.log('Gravar Item', resp.data)
    atualizaTableItens(resp.data)
  })
  .catch( err => {
    console.log('erro item: ', err)
  })
}

function salvarPedido(){
  console.log('Salvar Pedido')
  axios.post('salvarPedido', {salvar: 'ok'})
  .then(resp => {
    //console.log('Gravar pedido', resp)
  })
  .catch( err => {
    console.log('erro pedido: ', err)
  })
}


function atualizaTableItens (arrItens) {
  tbodyItens.innerHTML=''
  //Carregando linha de item na tabela
  arrItens.forEach(el => {
    console.log(el)
    let tbody = document.getElementById('tbodyItens')
    let tr = tbody.insertRow()
  
    let item = Object.values(el)
  
    let td_codprod = tr.insertCell()
    let td_descrprod = tr.insertCell()
    let td_vlrUnit = tr.insertCell()
    let td_qtd = tr.insertCell()
    let td_vlrTotal = tr.insertCell()
  
    td_codprod.innerText = item[0]
    td_descrprod.innerText = item[1]
    td_vlrUnit.innerText = item[3].toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits:2})
    td_qtd.innerText = item[2]
    td_vlrTotal.innerText = (item[3] * item[2]).toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits:2})
  
  });


}