const request = require('request');

// https://attacomsian.com/blog/node-http-requests-using-request-module
function testPostApi(){
    request.post({url: 'http://localhost:8999/goo', body:{"1":"2"}, json: true}, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        console.log(body);
    })
}

function testGetApi() {
    request.get({url: 'http://localhost:8999/router2/run/one?2=1', params:{"1":"2"}, json: true}, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        console.log(body);
    })
}

testGetApi()
