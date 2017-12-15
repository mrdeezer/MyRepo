var jsforce = require('jsforce');
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var callbackUri = '/oauth2/callback';
var http = require('https');
var response = ''
//
// OAuth2 client information can be shared with multiple connections.
//
var oauth2 = new jsforce.OAuth2({
  // you can change loginUrl to connect to sandbox or prerelease env.
  // loginUrl : 'https://test.salesforce.com',
  clientId : '<your client ID>',
  clientSecret : '<Your Client Secret>',
  redirectUri : 'http://localhost:5000/oauth2/callback'
});


//
// Get authorization url and redirect to it.
//
 app.get('/oauth2/auth', function(req, res) {
	console.log(oauth2.getAuthorizationUrl());
	res.redirect(oauth2.getAuthorizationUrl({}));	
}); 
// open connection with client's stored OAuth details
                
				  

//
// Pass received authorization code and get access token
//
app.get('/oauth2/callback', function(req, res) {
	console.log('hello');
  var conn = new jsforce.Connection({ oauth2 : oauth2 });
  var code = req.param('code');
  conn.authorize(code, function(err, userInfo) {
    if (err) { return console.error(err); }
    // Now you can get the access token, refresh token, and instance URL information.
    // Save them to establish connection next time.
	var options = {
					host: 'hostname.my.salesforce.com',
					port: 443,
					path: '/services/apexrest/Account/',
					headers: {'Host':'host.my.salesforce.com', 
					'Authorization':'OAuth '+conn.accessToken},
					method: 'GET'
				}
				http.request(options, function(res, err) {
					if (err)
						console.log(err);
					res.setEncoding('utf8');
					
					
					res.on('data', function (chunk) {
						console.log('BODY: ' + chunk);
						response = response + chunk;
					});
					
					
				}).end()
    console.log(conn.accessToken);
    console.log(conn.refreshToken);
    console.log(conn.instanceUrl);
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    // ...
    res.send('success'); // or your desired response
	
  });
  

  
});

app.listen(port);
console.log('Server is listening at'+port);