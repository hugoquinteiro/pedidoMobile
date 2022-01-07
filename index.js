const express = require("express");
const session = require('express-session')
const bodyParser = require('body-parser')
const app = express();
const select = require('./pgsql/select')
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



//Pedido
app.get("/pedido",(req, res) => {

  if(session.login){
    select('produto', 'marca').then(produtos => {
      var v_marca 
      produtos.forEach(function (valor, indice){
        v_marca = produtos[indice].marca
      })
      res.render('pedido', { produto : produtos})
    })
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
  console.log(login, password)
  select('usuario', 'login', `login='${login}' AND senha='${password}'`, '1').then(usuario => {
    console.log(usuario.length, usuario)
    if (usuario.length>0) {
      session.login = login
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

//Preparando Sessão
session.vendas = []

//Gravar Item
app.post('/gravarItem', (req, res) => {
  console.log(session)
  session.vendas.push(req.body)
  res.send(req.body.status);
})

//Salvar Pedido
app.post('/salvarPedido', (req, res) => {
  console.log(session.vendas)
  session.vendas = []
  res.send(req.body.status);
})

app.listen(port,()=>{console.log("App rodando em ", port);})
