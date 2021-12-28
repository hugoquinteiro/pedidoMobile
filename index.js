const express = require("express");
const app = express();
const port = 8001
const select = require('./pgsql/select')
//const insert = require('./db/insert')
//const sqlins = require('./db/insertML')

// Estou dizendo para o Express usar o EJS como View engine
app.set('view engine','ejs');
app.use(express.static('public'));


// Rotas
app.get("/",(req, res) => {
  res.render('index')
});

var temp = {}

temp.force = [
              {prod:123, vlrvenda: 10,descrprod: 'Prod Force'},
              {prod:321, vlrvenda: 200,descrprod: 'Force 2'},
],
temp.mqPro = [{prod:456,vlrvenda: 599,descrprod: 'Prod MQ PRO'}]              

//Pedido
app.get("/pedido",(req, res) => {

  select('produto', 'marca').then(produtos => {
    var v_marca 
    var marcas = []
    var tempMarcas = {}
    var i = 0
    produtos.forEach(function (valor, indice){
      if(v_marca!=produtos[indice].marca){
        //marcas.push(produtos[indice].marca)
        tempMarcas = produtos[indice].marca
        i++
        marcas.push({tempMarcas})
      }
      v_marca = produtos[indice].marca
      
    })
    //console.log(produtos)
    
    //console.log(marcas)


    //console.log({produto : produtos, marca: marcas})
    res.render('pedido', { produto : produtos})
  })

});


app.listen(port,()=>{console.log("App rodando em ", port);})
