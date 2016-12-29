var express = require('express')
var app = express()

app.set('view engine', 'pug');

urls = {};
service_url = "halberd:8080"


app.get('/', function(req, res, next){
    app.render('help', {});
})

app.get('/urls', function(req, res, next){
    res.json(urls)
})

app.all('/new/*', function(req, res, next){
    id = Math.floor(Math.random() * 10000)
    
    link = req.path.substr(5)
    
    if (link.match(/(https?:).*/) ){
        urls[id] = link;
    
        var binding = {}
        binding.original_url = link
        binding.id = id
        binding.new_url = service_url + "/" + id
    
    res.json(binding);
    } else {
        res.send(400)      
    }
})


var port;
port = process.env.PORT || 8080
app.listen(port, function () {
  console.log('Example app listening on port: '+port)
})
