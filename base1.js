var login = require('./login')


login.then((res) => {
	var session = res
	return session
})
.then((res2) => console.log('Retorno Login:', res2))


