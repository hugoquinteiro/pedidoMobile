console.log('Pedido Carregou')
var myModal = new bootstrap.Modal(document.getElementById('addItemModal'), {})

var tbodyItens = document.getElementById('tbodyItens')

function loadFormItem(codprod){
  //let tbody = document.getElementById('tbodyItens')
  let itens = document.getElementById('btnAdd-'+codprod)
  //console.log('itens', itens.getAttribute('key'))
  let key = itens.getAttribute('key')
  var arritens = []
  arritens =  key.split('|;')  //JSON.parse
  console.log('itens', arritens)
  var codprod = arritens[0]
  var descrprod = arritens[1]
  var preco = arritens[2]
  var estoque = arritens[3]
  var estInfo = document.getElementById('estInfo')
  var precoItem = document.getElementById('precoItem')
  var quantidade = document.getElementById('quantidade')
  var tittle = document.getElementById('addItemModalTittle')  

  //Verifica se o item já existe no pedido
  //var codprod = item.substring(0, item.indexOf(' -')).trim()
  tittle.innerText = `${codprod} - ${descrprod}`
  estInfo.innerHTML = estoque
  quantidade.value = 1
  precoItem.value = preco
  for (let i =0; i < tbodyItens.rows.length; i++){
    console.log(tbodyItens.rows[i].cells[0].innerHTML, '->',codprod)
    if ((tbodyItens.rows[i].cells[0].innerHTML) === codprod) {
      //console.log(tbodyItens.rows[i].cells[0].innerHTML, codprod)
      precoItem.value = tbodyItens.rows[i].cells[2].innerHTML
      quantidade.value = tbodyItens.rows[i].cells[3].innerHTML
      i=999
    } else {
      quantidade.value = 1
      precoItem.value = preco
    }
  }

  //precoItem.value = preco
  myModal.toggle()
}


function gravarItem(){
  console.log('Gravar Item')
  var item = document.getElementById('addItemModalTittle').textContent;
  var quantidade = document.getElementById('quantidade').value;
  var precoItem = document.getElementById('precoItem').value;

  if(isNaN(precoItem)){
    alert('não é valor')
  }
  
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

  axios.post('/gravarItem', {dados: dadosItem})
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
  axios.post('/salvarPedido', {salvar: 'ok'})
  .then(resp => {
    console.log('Gravar pedido', resp.data)
    window.location.href = '/';
  })
  .catch( err => {
    console.log('erro pedido: ', err)
  })
}


function atualizaTableItens (arrItens) {
  tbodyItens.innerHTML=''
  const btnPedido = document.getElementById('btnPedido')
  let totalped = document.getElementById('totalped') 
  var total = 0
  //Carregando linha de item na tabela
  arrItens.forEach(el => {
    //console.log(el)
    let tbody = document.getElementById('tbodyItens')
    let tr = tbody.insertRow()
  
    let item = Object.values(el)
  
    let td_codprod = tr.insertCell()
    let td_descrprod = tr.insertCell()
    let td_vlrUnit = tr.insertCell()
    let td_qtd = tr.insertCell()
    let td_vlrTotal = tr.insertCell()
    let td_delete = tr.insertCell()
  
    td_codprod.innerText = item[0]
    td_descrprod.innerText = item[1]
    td_vlrUnit.innerText = item[3].toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits:2})
    td_qtd.innerText = item[2]
    td_vlrTotal.innerText = (item[3] * item[2]).toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits:2})
    td_vlrTotal.setAttribute ("class", "formartNumber")
    td_vlrUnit.setAttribute ("class", "formartNumber")
    td_qtd.setAttribute ("class", "formartNumber")
    td_delete.innerHTML = `<button class="btnDelete btn btn-danger"><i class="fas fa-trash"></i></button>`
    total+=(item[3] * item[2])
  });
  console.log('Atualizando Totais', total)
  totalped.innerHTML = total.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits:2})
  btnPedido.innerHTML =`<i class="fas fa-dollar-sign"></i> ${total.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits:2})}` 


}

//Função DELETE ITEM do PEDIDO
function deleteItem(e) {
  if(!e.target.classList.contains("btnDelete")) {
    return;
  }

  const btnDel = e.target
  btnDel.closest('tr').remove()
  //updateTotal()
  console.log('Removendo Item')
}
tableItens.addEventListener('click', deleteItem)

function loadIndex(){
  console.log('Carregando pedidos')
  let table = document.getElementById('tablePedidos')
  axios.get('/listaPedidos')
  .then(resp => {
    console.log(resp.data.pedidos)
    resp.data.pedidos.forEach(el => {
      let tr = table.insertRow()

      let td_id = tr.insertCell()
      let td_data = tr.insertCell()
      let td_cliente = tr.insertCell()
      let td_total = tr.insertCell()
      let td_icone = tr.insertCell()

      td_id.innerText = el.id
      td_data.innerText = el.dtcria.substring(0,10)
      td_cliente.innerText = el.cliente
      td_total.innerText = el.total

      let tipoIcone
      switch(el.statusped) {
        case 'PED':
          tipoIcone = 'share-square'
          break;
        case 'INT':
          tipoIcone = 'check'
          break;
        case 'FAT':
            tipoIcone = 'check-double'
          break;
          default:
            tipoIcone = 'bug'
      }
      td_icone.innerHTML = `<i class="fas fa-${tipoIcone}" id="status" key="${el.id}"  onclick="atualizaPedido(${el.id})"></i>`
    })
 
  })
  .catch(err => console.log('Erro:',err))  
}


function atualizaPedido(idPedido) {
  console.log('Status Pedido', idPedido)
  axios.post('/sincPedido', {pedido: idPedido})
  .then (res =>{
    console.log(res)
  })
  .catch(err =>{alert('Erro no Status do Pedido',err)})
}


//JQuery para tratar campo de valor com tag pattern
$(document).on('keydown', 'input[pattern]', function(e){
  var input = $(this);
  var oldVal = input.val();
  var regex = new RegExp(input.attr('pattern'), 'g');

  setTimeout(function(){
    var newVal = input.val();
    if(!regex.test(newVal)){
      input.val(oldVal); 
    }
  }, 0);
});