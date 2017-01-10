var express = require('express')
var app = express()

app.set('view engine', 'pug');

service_url = process.env.SERVICE_URL

//var mongo = require('tingodb')()
//var db = new mongo.Db(process.cwd()+'/data', {})

var mongo = require('mongodb')
var MongoClient=mongo.MongoClient

db_url = process.env.DB_URL

//making a false db object to mimic the deprecated syntax of the Node.js mongodb driver.
//this allows for the code to stay more compatible with tingodb.
var db = {};
db.open = function(callback){
    MongoClient.connect(db_url, function(err, db){
        callback(err, db);
    });
}


app.get('/', function(req, res, next){
    res.render('help', {url:service_url});
})




app.all('/new/*', function(req, res, next){
    id = Math.floor(Math.random() * 10000)
    
    link = req.path.substr(5)
    
    if (link.match(/(https?:\/\/).*/) ){
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
                return
            }
            if(!doc){
                res.sendStatus(404);
                return 
            }
            
            //res.json(doc)
            res.redirect(308, doc.link)
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




var port;
port = process.env.PORT || 8080
app.listen(port, function () {
  console.log('Example app listening on port: '+port)
})
