const express = require("express");
const session = require('express-session')
const bodyParser = require('body-parser')
const app = express();
const select = require('./pgsql/select')
const selectFull = require('./pgsql/selectFull')
const insertPedido = require('./pgsql/insertPedido')
const update = require('./pgsql/update')
const portalocal = 8001
const sincPedido = require('./api/sincPedido')


// Estou dizendo para o Express usar o EJS como View engine
app.set('view engine','ejs');
app.use(express.static('public'));

  //Implementação do session
  app.use(session({secret:'abc@123',
                    resave: true,
                    saveUninitialized: true}))

//Carregando bodyParser
  app.use(bodyParser.urlencoded({extended:true}))
  app.use(bodyParser.json())

// Rotas
app.get("/",(req, res) => {
  if(req.session.login){
    res.render('index')
  } else {
    res.render('login')
  }
  
});



//GET para login
app.get('/login', (req,res) => {
  console.log('Solicitação de Login')
  res.render('login')
})

//GET para auth
app.post('/auth', (req,res) =>{
  var login = req.body.login.toUpperCase()
  var password = req.body.password
  select('usuario', 'login', `login='${login}' AND senha='${password}'`, '1').then(usuario => {
    if (usuario.length>0) {
      //req.session.login = {usuario: usuario, codvend: codvend}
      //console.log(usuario)
      req.session.login = usuario
      console.log(req.session.login)
      res.render('index')
    } else {
      res.render('login')
    }
  })
  
})

app.get('/logout', (req, res) => {
  //req.session.login = ''
  console.log('LOGOUT')
  delete req.session.login
  res.render('login')
})

//Cabeçalho do Pedido
app.get('/pedidocabecalho', (req, res) => {
  if(req.session.login){
    console.log('Codvend', req.session.login[0].codvend)
    select('cliente', 'razaosocial', `codvend=${req.session.login[0].codvend}`).then(clientes => {
      res.render('pedidoCab', {cliente: clientes} )  
    })
  } else {
    res.render('login')
    console.log('Erro no login do Cabeçalho')
  }
})

//Pedido
app.get(`/pedido/:id`,(req, res) => {
  console.log('codparc esta aqui',req.params.id)
  if(req.session.login){
      req.session.cliente = req.params.id
      var query = 
          `SELECT tab.codprod, pro.descrprod, tab.vlrvenda, pro.marca, (est.estoque-est.reservado) as estoque
           FROM ittabela as tab 
           INNER JOIN produto as pro ON (tab.codprod=pro.codprod) 
           LEFT JOIN ESTOQUE AS est ON (tab.codprod=est.codprod) 
           WHERE tab.nutab=(SELECT nutab FROM TABELA WHERE codtab=(SELECT codtab FROM cliente WHERE codparc=${req.params.id}))
           AND est.codemp = (SELECT codemp FROM cliente WHERE codparc=${req.params.id})
           ORDER BY pro.marca, pro.descrprod;`
      selectFull(query).then(produtos => {
        //console.log(produtos)
        res.render('pedido', { produto : produtos})
      })
  } else {
    res.render('login')  
  }
});


//Gravar Item
app.post('/gravarItem', (req, res) => {
  //console.log('chegou gravar Item')
  if (req.session.vendas) {
    req.session.vendas.forEach((el,i) => {
      //console.log(el.codprod , req.body.dados.codprod)
      if (el.codprod == req.body.dados.codprod) {
        req.session.vendas.splice(i,1);
      }
    })
    req.session.vendas.push(req.body.dados)
  } else {
    req.session.vendas = []
    req.session.vendas.push(req.body.dados)
  }
  //console.log(req.session.vendas)
  
  //toda requisição precisa de uma resposta, sem isso estava travando o sistema
  res.send(req.session.vendas);
})

//Salvar Pedido
app.post('/salvarPedido', (req, res) => {
  let dtcria = new Date()
  //console.log(req.session.cliente, req.session.vendas)
  var query = `SELECT codemp FROM cliente WHERE codparc=${req.session.cliente};`
  //console.log(req.session.login[0].codvend, req.session.login[0].id)
  selectFull(query).then(codemp =>{
    let cab = {idlogin:req.session.login[0].id,
               dtcria: dtcria,
               codvend: req.session.login[0].codvend,
               codparc: req.session.cliente,
               codemp: codemp[0].codemp  
              }
    //console.log(cab, req.session.vendas)
    let itensVenda = []

    req.session.vendas.forEach(valor =>{
      itensVenda.push(Object.values(valor))
    })

    //console.log(itensVenda)
    insertPedido(cab, itensVenda).then(retorno =>{
      //console.log('retorno',retorno)
      res.send({status:'200'})
    })
    //Zera seção após gravação
    req.session.vendas = []  
  })
  .catch(err =>{console.log(err)})
})

app.get('/listaPedidos',(req,res) =>{
  //console.log('lista pedidos...')
  let query = `SELECT COALESCE(nunota, id) as id, to_char(dtcria, 'DD/MM/YYYY') as dtcria, (SELECT nomeparc FROM cliente WHERE codparc=pedido.codparc) as cliente, total, statusped
              FROM pedido WHERE codvend= ${req.session.login[0].codvend};`
  selectFull(query).then(result =>{
    let listaPedidos = result
    res.send({pedidos: listaPedidos})
  })
  .catch(err => {console.log(err)})
})

app.post('/sincPedido', (req, res) => {
  sincPedido(req.body.pedido)
  .then(resapi => {
    console.log(resapi.nunota.$)
    let query = `UPDATE pedido SET nunota=${resapi.nunota.$}, statusped='INT' WHERE id=${req.body.pedido}`
    update(query).then(resquery => {res.send('ok')}).catch(err => console.log(err))
  })
  .catch(err=>{console.log('ERRO sincPedido:', err)})
  
})

// app.listen(process.env.PORT || portalocal,
//           ()=>{console.log("App rodando em ", process.env.PORT || portalocal);
//               })

// for an express app, the server is returned from the `.listen()` method
let server = app.listen(process.env.PORT || portalocal,
            ()=>{console.log("App rodando em ", process.env.PORT || portalocal);
                })


//implementei essa parte para tentar subir o App no HEROKU                
server.on('clientError', (err, socket) => {
  console.error(err);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
