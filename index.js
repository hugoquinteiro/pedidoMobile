const express = require("express");
const session = require('express-session')
const bodyParser = require('body-parser')
const app = express();
const select = require('./pgsql/select')
const selectFull = require('./pgsql/selectFull')
const port = 8001


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
           ORDER BY pro.marca;`
      selectFull(query).then(produtos => {
        console.log(produtos[0])
        res.render('pedido', { produto : produtos})
      })
  } else {
    res.render('login')  
  }
});

app.get('/teste', (req, res) => {
  console.log('chegou no Get', req.body)
  res.send('Chegou aqui')
})

//Gravar Item
app.post('/gravarItem', (req, res) => {
  console.log('chegou gravar Item')
  if (req.session.vendas) {
    req.session.vendas.forEach((el,i) => {
      console.log(el.codprod , req.body.dados.codprod)
      if (el.codprod == req.body.dados.codprod) {
        req.session.vendas.splice(i,1);
      }
    })
    req.session.vendas.push(req.body.dados)
  } else {
    req.session.vendas = []
    req.session.vendas.push(req.body.dados)
  }
  console.log(req.session.vendas)
  
  //toda requisição precisa de uma resposta, sem isso estava travando o sistema
  res.send(req.session.vendas);
})

//Salvar Pedido
app.post('/salvarPedido', (req, res) => {
  console.log(req.session.cliente, req.session.vendas)
  req.session.vendas = []
  res.render('index');
})

app.listen(port,()=>{console.log("App rodando em ", port);})
