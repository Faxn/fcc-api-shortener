var express = require('express')
var app = express()

app.set('view engine', 'pug');

service_url = "halberd:8080"

//var mongo = require('tingodb')()
//var db = new mongo.Db(process.cwd()+'/data', {})

var mongo = require('mongodb')
var db = new mongo.Db("test", mongo.Server("localhost", 27017) )

app.get('/', function(req, res, next){
    app.render('help', {});
})

app.get(/(\d+)/, function(req, res, next){
    id = parseInt(req.params[0])
    db.open(function(err, db){
        if(err) {
            console.log(err)
            res.status(500).send(err)
        }
        urls = db.collection('urls')
        urls.findOne({'_id':id}, function(err, doc){
            if(err) {
                console.log(err)
                res.status(500).send(err)
            }
            res.json(doc)
        })
        db.close()
    })
})


app.get('/urls', function(req, res, next){
    db.open(function(err, db){
        if(err) {
            console.log(err)
            res.status(500).send(err)
        }
        urls = db.collection('urls')
        urls.find().toArray(function(err, array){
            res.json(array)
        });
        
        db.close()            
    })   
})

app.all('/new/*', function(req, res, next){
    id = Math.floor(Math.random() * 10000)
    
    link = req.path.substr(5)
    
    if (link.match(/(https?:).*/) ){
        db.open(function(err, db){
            if(err) {
                console.log(err)
                res.status(500).send(err)
            }
            urls = db.collection('urls')
            urls.insert({"_id":id, "link":link})
            db.close()
        })
    
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
