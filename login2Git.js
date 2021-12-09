const express = require('express')
const  cors = require('cors')
const app = express()
const port = 3000


app.use(cors())
app.use(express.json()) 


app.post('/login', (req, res) => {
 
const  {nome , password} = req.body;


const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function login(nome, pwd){

    const url = 'http://192.168.1.56:8380/mge/service.sbr?serviceName=MobileLoginSP.login&outputType=json';

    let strBody = '{ "serviceName": "MobileLoginSP.login", "requestBody": { "NOMUSU": { "$": "'+nome+'" }, "INTERNO":{ "$": "'+pwd+'" }, "KEEPCONNECTED": { "$": "S" } } }';

    let options = { 
        method: 'POST',
        qs: {serviceName: 'MobileLoginSP.login', outputType: 'json'},
        headers: {
            'Content-Type': 'application/json',
            cookie: 'JSESSIONID=og0DUV3g4yHY5lkZhfCIOPc_zZdtpg-Sbz_NFZqq.master; '
        },
        body : strBody,
    };

  
    fetch(url, options)
         .then(res => res.json())
         .then(json => {
            // var JSESSIONID = json.responseBody.jsessionid.$;
            var date = Date.now();
            userInfo = {
                // JSESSIONID,
                date,
            }
            return res.json(json);
         })
         .catch(err => console.error('error:' + err));

         
}

login(nome,password);

})



app.post("/dados" , (req , res) => {
    const {nome, JSESSIONID} = req.body;

    console.log(nome, JSESSIONID);

    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

    (function load(){
        const url = 'http://192.168.1.56:8380/mge/service.sbr?serviceName=DbExplorerSP.executeQuery&outputType=json';
        // const sqlQuery = `Select CODUSU, CODEMP, NOMEUSU from TSIUSU WHERE NOMEUSU = '${nome}' ;`;
        const body = `{"serviceName":"DbExplorerSP.executeQuery","requestBody":{"sql":"Select CODUSU, CODEMP, NOMEUSU from TSIUSU WHERE NOMEUSU = \'${nome}\' "}}` ;
        

        let options = { 
            method: 'POST',
            // qs: {serviceName: 'DbExplorerSP.executeQuery', outputType: 'json'},
            headers: {
                'Content-Type': 'application/json',
                cookie: `JSESSIONID=${JSESSIONID}; `,
            },
            body : body,
        };

        console.log(options)

        fetch(url, options)
            .then(res => {
                return res.json()
            })
            .then(json => res.json(json))
            .catch(err => console.error('error:' + err));

    }())

})


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})