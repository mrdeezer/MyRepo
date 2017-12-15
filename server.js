// code for oauth
var jsforce = require('jsforce');
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;

var oauth2 = new jsforce.OAuth2({
clientId : '3MVG9d8..z.hDcPJewHdoszN9qteZjdfebCii49aD333eZZWp35Mh9U7wu4ObwwFocdFuww5QVQ_tJmtMYZXA',
clientSecret : '8667940592181644129',
redirectUri : 'https://yewalachalega.herokuapp.com'
});

/* SF OAuth request, redirect to SF login */
app.get('/oauth2/auth', function(req, res) {
res.redirect(oauth2.getAuthorizationUrl({scope: 'api id web'}));
});

/* OAuth callback from SF, pass received auth code and get access token */

app.get('/auth/callback', function(req, res) {
var conn = new jsforce.Connection({oauth2: oauth2});
var code = req.param('code');
conn.authorize(code, function(err, userInfo) {
if (err) {
return console.error(err);
}
req.session.accessToken = conn.accessToken;
req.session.instanceUrl = conn.instanceUrl;
req.session.refreshToken = conn.refreshToken;
console.log(conn.refreshToken);
var app_json = { "accessToken": req.session.accessToken, "instanceUrl": req.session.instanceUrl, "OrgID":userInfo.organizationId, "refreshtoken": req.session.refreshToken}; //userInfo.organizationId
filesystem.appendFile('sfdc_auth_02.txt', JSON.stringify(app_json) + ',', function (err) {
if (err) throw err;
});
URL = "URL which I'm using for oauth"
res.redirect('/dfty/case');
});
});

app.get('/dfty/case', function(req, res) {
// if auth has not been set, redirect to index
if (typeof req.session == 'undefined' || !req.session.accessToken || !req.session.instanceUrl) {
console.log(Date() + ' - ' + run_id + ' - Not yet authorized, so redirecting to auth');
res.redirect('/oauth2/auth?f=cases');
} else {
var query = 'SELECT CaseNumber, Subject, Origin FROM case LIMIT 10';
}
});

app.listen(port);
console.log('Server is listening at'+port);