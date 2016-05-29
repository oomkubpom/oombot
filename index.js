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
      console.log(text)
      var len = text.length
      var getFunction = text.substring(0, 3)
      console.log('func : ' + getFunction)

      if (getFunction === 'sum') {
        var gettext = text.substring(4, text.length)
        console.log('number : ' + gettext)
        var blank = gettext.search(' ')
        var num1 = parseFloat(gettext.substring(0, blank))
        var num2 = parseFloat(gettext.substring(blank, gettext.length))
        console.log('number1 : ' + num1 + ' number2 : ' + num2)
        var sum = num1 + num2
        console.log('sum : ' + sum)
        sendTextMessage(sender, sum)
      }
      else if (getFunction === 'max') {
        var gettext = text.substring(4, text.length)
        console.log('number : ' + gettext)
        var blank = gettext.search(' ')
        var num1 = parseFloat(gettext.substring(0, blank))
        var num2 = parseFloat(gettext.substring(blank, gettext.length))
        console.log('number1 : ' + num1 + ' number2 : ' + num2)
        if (num1 > num2) {
          sendTextMessage(sender, num1)
        }
        if (num2 > num1) {
          sendTextMessage(sender, num2)
        }
      }
      else if (getFunction === 'min') {
        var gettext = text.substring(4, text.length)
        console.log('number : ' + gettext)
        var blank = gettext.search(' ')
        var num1 = parseFloat(gettext.substring(0, blank))
        var num2 = parseFloat(gettext.substring(blank, gettext.length))
        console.log('number1 : ' + num1 + ' number2 : ' + num2)
        if (num1 < num2) {
          sendTextMessage(sender, num1)
        }
        if (num2 < num1) {
          sendTextMessage(sender, num2)
        }
      }
      else if (getFunction === 'avg') {
        var num = []
        var sum = 0
        var gettext = text.substring(4, text.length)
        console.log('text : ' + gettext)
        num = gettext.split(' ')
        console.log('split : ' + num + ' len = ' + num.length)
        for (var i = 0;i < num.length;i++) {
          sum += parseFloat(num[i])
        }
        console.log('sum : ' + sum + 'avg : ' + sum/num.length)
        sendTextMessage(sender, sum/num.length)
      }
      else {
        sendTextMessage(sender,"pls input sum,max,min and 2 number or input avg and number1 - numberN")
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
