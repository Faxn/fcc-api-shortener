var express = require('express')
var app = express()

app.set('view engine', 'pug');

service_url = "halberd:8080"

var url_store = {}
url_store.urls = {}

url_store.put = function(id, link){
    this.urls[id] = link
}
url_store.get = function(id){
    return this.urls[id]
}
url_store.list = function(){
    return this.urls
}



app.get('/', function(req, res, next){
    app.render('help', {});
})

app.get(/(\d+)/, function(req, res, next){
    id = parseInt(req.params[0])
    dest = url_store.get(id)
    res.json(dest)
})


app.get('/urls', function(req, res, next){
    
    res.json(url_store.list())
})

app.all('/new/*', function(req, res, next){
    id = Math.floor(Math.random() * 10000)
    
    link = req.path.substr(5)
    
    if (link.match(/(https?:).*/) ){
        url_store.put(id, link)
    
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
