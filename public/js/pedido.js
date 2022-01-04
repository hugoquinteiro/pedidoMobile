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

  var dadosItem = {
    produto : item,
    quantidade : quantidade,
    preco:  precoItem
  }

  myModal.hide()

  axios.post('gravarItem', {dados: dadosItem})
  .then(resp => {
    console.log('Fechar Modal')
  })
}

function salvarPedido(){
  console.log('Salvar Pedido')
  axios.post('salvarPedido', {salvar: 'ok'})
  .then(resp => {
    console.log('then para fechar pedido')
  })
}