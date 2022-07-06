const express = require("express");
const session = require('express-session')
const bodyParser = require('body-parser')
const app = express();
const select = require('./pgsql/select')
const selectFull = require('./pgsql/selectFull')
const insertPedido = require('./pgsql/insertPedido')
const insertCliente = require('./pgsql/insertCliente')
const update = require('./pgsql/update')
const portalocal = 8001
const sincPedido = require('./api/sincPedido')
const consulta = require('./api/DbExplorerSP')
const atualizaProdBD = require('./pgsql/insertUpdateProduto')
const atualizaPrecoBD = require('./pgsql/insertUpdatePreco')
const atulizaPrecoItemBD = require('./pgsql/insertUpdatePrecoItem')
const atualizaEstoque = require('./pgsql/insertUpdateEstoque')
const atualizaCliente = require('./pgsql/insertUpdateCliente')


// Estou dizendo para o Express usar o EJS como View engine
app.set('view engine','ejs');
app.use(express.static('public'));

  //Implementação do session
  app.use(session({secret:'abc@123',
                    resave: true,
                    saveUninitialized: true}))

//Carregando bodyParser
  app.use(bodyParser.urlencoded({extended:false})) //alterando pra False na implementação de clientes
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
  if(req.session.login){
      req.session.cliente = req.params.id
      var query = 
          `SELECT t1.codprod, pro.descrprod, ROUND(COALESCE(t2.vlrvenda,t1.vlrvenda*((100 + tab.percentual)/100)),2) as vlrvenda,  pro.marca, (est.estoque-est.reservado) as estoque
          FROM tabela tab
          INNER JOIN ittabela t1 ON (t1.nutab=(SELECT nutab FROM tabela WHERE codtab=tab.codtaborig))
          LEFT JOIN ittabela t2 ON ((t2.nutab=(SELECT nutab FROM tabela WHERE codtab=tab.codtab)) AND t2.codprod = t1.codprod)
          LEFT JOIN produto pro ON (t1.codprod = pro.codprod)
          LEFT JOIN ESTOQUE est ON (t1.codprod=est.codprod) 
          AND est.codemp = (SELECT codemp FROM cliente WHERE codparc=${req.params.id})
          WHERE tab.codtab=(SELECT codtab FROM cliente WHERE codparc=${req.params.id})
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
      //console.log(el.codprod , req.body.dados.codprod, 'TRUE?:', el.codprod == req.body.dados.codprod)
      //console.log('Antes:',req.session.vendas)
      if (el.codprod == req.body.dados.codprod) {
        req.session.vendas.splice(i,1);
      }
    })
    req.session.vendas.push(req.body.dados)
  } else {
    req.session.vendas = []
    req.session.vendas.push(req.body.dados)
  }

  //console.log('Pedidos:',req.session.vendas)
  //console.log(req.session.vendas)
  
  //toda requisição precisa de uma resposta, sem isso estava travando o sistema
  res.send(req.session.vendas);
})

//Salvar Pedido
app.post('/salvarPedido', (req, res) => {
  let dtcria = new Date()
  var query = `SELECT codemp FROM cliente WHERE codparc=${req.session.cliente};`
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

//Sincronização manual inicialmente
app.get('/sincro', (req,res) =>{
  //Sincronização de usuário e empresa ainda esta manual
  
  const tgfpro = `SELECT CODPROD, DESCRPROD, MARCA, REFERENCIA, (SELECT CODBARRA FROM TGFBAR WHERE CODPROD=TGFPRO.CODPROD) AS CODBARRA 
                  FROM TGFPRO WHERE CODPROD IN (
                    SELECT distinct codprod FROM tgfexc WHERE nutab IN (
                    (SELECT nutab FROM TGFTAB TAB WHERE codtab IN (SELECT DISTINCT codtab FROM tgfpar WHERE codvend IN (SELECT codvend FROM tgfven WHERE AD_ENVIAMOBILE='S')) AND dtvigor=(SELECT MAX(dtvigor) FROM tgftab WHERE codtab=tab.codtab))
                    )
                  ) AND ATIVO='S' AND AD_ION_ENVIA='S'
                  `
const tgftab = `SELECT nutab, codtab, to_char(dtvigor,'YYYY-MM-DD') AS dtvigor, codtaborig, percentual
                FROM tgftab tab WHERE codtab IN (
                SELECT DISTINCT codtab FROM tgfpar WHERE codvend IN (SELECT codvend FROM tgfven WHERE AD_ENVIAMOBILE='S')
                ) AND dtvigor=(SELECT MAX(dtvigor) FROM tgftab WHERE codtab=tab.codtab)
                `
const tgfexc = `SELECT nutab, codprod, replace(vlrvenda,',','.') as vlrvenda FROM tgfexc
                WHERE nutab IN (
                    SELECT nutab  FROM tgftab tab WHERE codtab IN (
                    SELECT DISTINCT codtab FROM tgfpar WHERE codvend IN (SELECT codvend FROM tgfven WHERE AD_ENVIAMOBILE='S')
                    ) AND dtvigor=(SELECT MAX(dtvigor) FROM tgftab WHERE codtab=tab.codtab)
                ) 
                AND codprod IN ( SELECT codprod FROM tgfpro WHERE  ATIVO='S' AND AD_ION_ENVIA='S')
                `
const tgfest = `SELECT CODEMP, CODPROD, RESERVADO, ESTOQUE FROM TGFEST 
                WHERE TIPO='P' AND CODLOCAL=2 AND CODEMP IN (2,12,13) AND codparc=0
                AND codprod IN ( SELECT DISTINCT codprod FROM tgfexc
                                WHERE nutab IN (
                                    SELECT nutab  FROM tgftab tab WHERE codtab IN (
                                    SELECT DISTINCT codtab FROM tgfpar WHERE codvend IN (SELECT codvend FROM tgfven WHERE AD_ENVIAMOBILE='S')
                                    ) AND dtvigor=(SELECT MAX(dtvigor) FROM tgftab WHERE codtab=tab.codtab)
                                ) 
                                AND codprod IN ( SELECT codprod FROM tgfpro WHERE  ATIVO='S' AND AD_ION_ENVIA='S')
                )
                `
const tgfpar = `SELECT codparc, nomeparc, razaosocial, cgc_cpf, CODVEND , codtab
                ,COALESCE((SELECT sugtipnegsaid FROM TGFCPL WHERE codparc=tgfpar.codparc),1) as tipneg, COALESCE(codemppref,0) codemppref
                FROM tgfpar 
                WHERE codvend IN (SELECT codvend FROM tgfven WHERE AD_ENVIAMOBILE='S') 
                `
                

  consulta(tgfpro).then( resp1 => {
    atualizaProdBD(resp1).then(pro => { console.log('Itens:', pro)
      consulta(tgftab).then( resp2 => {
        atualizaPrecoBD(resp2).then(tab => { console.log('Tabelas:', tab)
          consulta(tgfexc).then(resp3 =>{
            atulizaPrecoItemBD(resp3).then(ite => {console.log('Preço Item:', ite)
              consulta(tgfest).then(resp4 =>{
                atualizaEstoque(resp4).then( est =>{console.log('est: ', est)
                  consulta(tgfpar).then(resp5 => {
                    atualizaCliente(resp5).then( par => {console.log('Cli:', par)
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })



  res.send('200')
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
  console.log('Pedido:****', req.body.pedido)
  sincPedido(req.body.pedido)
  .then(resapi => {
    console.log(resapi.nunota.$)
    let query = `UPDATE pedido SET nunota=${resapi.nunota.$}, statusped='INT' WHERE id=${req.body.pedido}`
    update(query).then(resquery => {res.send('ok')}).catch(err => console.log(err))
  })
  .catch(err=>{console.log('ERRO sincPedido:', err)})
  
})


app.get('/cliente',(req,res) =>{
  //console.log('lista pedidos...')
  let query = `SELECT codparc, nomeparc, razaosocial, cgc_cpf FROM cliente WHERE codvend= ${req.session.login[0].codvend};`
  selectFull(query).then(result =>{
    let cliente = result
    res.render('cliente', {clientes: cliente})
  })
  .catch(err => {console.log(err)})
})

app.post('/incluircliente',(req, res) => {
  req.body.codvend = req.session.login[0].codvend
  insertCliente(req.body)
  .then( retorno =>{res.send('OK - 200')})
  //.catch( err => res.send('Erro', err))
  
})



let server = app.listen(process.env.PORT || portalocal,
            ()=>{console.log("App rodando em ", process.env.PORT || portalocal);
                })


//implementei essa parte para tentar subir o App no HEROKU                
server.on('clientError', (err, socket) => {
  console.error(err);
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
