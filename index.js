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

//Pedido
app.get("/pedido",(req, res) => {

  select('produto', 'marca').then(produtos => {

    console.log(produtos)
    // produtos.forEach(function (valor, indice){
    //   valor.vlrvenda2 = parseFloat(valor.vlrvenda).toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits:2})
    //  // console.log(valor.vlrvenda2)
    //   switch(valor.marca){
    //     case 'FORCE BARB': marcaForce.push(valor)
    //     break
    //     case 'MQ BEAUTY' : marcaBeauty.push(valor) 
    //     break
    //     case 'MQ ESCOVAS' : marcaEscovas.push(valor) 
    //     break
    //     case 'MQ PRO' : marcaPro.push(valor) 
    //     break
    //     case 'PARLUX' : marcaParlux.push(valor) 
    //     break
    //   }

    // })
    //console.log(marcaBeauty)
    res.render('pedido', {produto:produtos})
  })

});


app.listen(port,()=>{console.log("App rodando em ", port);})
