console.log('Pedido Carregou')



function loadFormItem(codprod){
  var myModal = new bootstrap.Modal(document.getElementById('addItemModal'), {})
  var item = document.getElementById('item-'+codprod).innerHTML
  var preco = document.getElementById('preco-'+codprod).innerHTML
  var estoque = document.getElementById('estoque-'+codprod).innerHTML
  var estInfo = document.getElementById('estInfo')
  var tittle = document.getElementById('addItemModalTittle')
  tittle.innerText = item
  estInfo.innerHTML = estoque
  myModal.toggle()

}