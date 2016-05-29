var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

var token = "EAAKG5hD8ozkBADOpDTfsEPDUS7xPuSeEhwLOj1Y1K0KYJe3yNtb6mJZAfAlc1obACVtniAK7OTF7pSo6ZBQeCU3JaMlCrorsvLFOVD3TNTLV348UtCC0pMEnJdamgZBL6mZBCYWi4NArV9veKqms49cN23nETkcSNnI8i1ozRQZDZD";

app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === '1234') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})

app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging;
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i];
    var sender = event.sender.id;
    if (event.message && event.message.text) {
      var text = event.message.text;
      var res = text.substring(0, 2);
      //var num1 = text.substring(4, 4);
      // Handle a text message from this sender
      console.log(text);
      if (res === 'sum') {
        sendTextMessage(sender,num1);
      }
      else if (res === 'max') {
        sendTextMessage(sender,"max");
      }
      else if (text === 'min') {
        sendTextMessage(sender,"min")
      }
      else if (text === 'avg') {
        sendTextMessage(sender,"")
      }
      else {
        sendTextMessage(sender, "I don't know");
      }
    }
  }
  res.sendStatus(200);
});

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function () {
  console.log('Example app listening on port ' + app.get('port') + '!');
});

function sendTextMessage(sender, text) {
  var messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}
