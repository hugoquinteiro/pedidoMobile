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
  res.render('index')
});



//Pedido
app.get("/pedido",(req, res) => {

  select('produto', 'marca').then(produtos => {
    var v_marca 
    produtos.forEach(function (valor, indice){
      v_marca = produtos[indice].marca
    })

    res.render('pedido', { produto : produtos})
  })

});

session.vendas = []

//Gravar Item
app.post('/gravarItem', (req, res) => {
  session.vendas.push(req.body)
})

//Salvar Pedido
app.post('/salvarPedido', (req, res) => {
  console.log(session.vendas)
})

app.listen(port,()=>{console.log("App rodando em ", port);})
