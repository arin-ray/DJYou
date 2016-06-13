var http = require('http');
var tropowebapi = require('tropo-webapi');
var request = require('request');
var api = require('genius-api');
var genius = new api('API_KEY');
http.createServer(function (req, res) {
    var json;
    var message = "Did you mean: \n";
    req.addListener('data', function(data){
        json = data.toString();
    });
    
    req.addListener('end', function() {
	    var tropo = new tropowebapi.TropoWebAPI();
        
		if(json === undefined || json === ''){
	    
            tropo.say('Didn\'t catch that');
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(tropowebapi.TropoJSON(tropo));
        }else{
          var session = JSON.parse(json);
          var initialText = session.session.initialText;
          genius.search(initialText).then(function(response) {
            tropo.say(message)
            for(var i=0;i<3;i++){
                console.log(response.hits[i].result.full_title); 
                tropo.say((i+1).toString() + ') '+response.hits[i].result.full_title+'\n');
            }
    
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(tropowebapi.TropoJSON(tropo));
        });
        }
	});

        
}).listen(9000);
