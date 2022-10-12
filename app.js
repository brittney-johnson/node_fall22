var express = require('express');
var mongoose = require('mongoose');
var app = express();

app.use('/static', express.static("public"));
app.use(express.urlencoded({extented: true}))
app.set("view engine", "ejs");
const Todo = require('./models/todo.model');
const mongoDB = 'mongodb+srv://johnson_brittney:f7DMAlhjr1tCA2hx@cluster0.9h3xlni.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoDB)
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDb connection error: "))



app.get('/', function(req, res){
    res.render('todo.ejs');
})
//creates item in DB
app.post('/', (req, res) => {
    let newTodo = new Todo({
        todo: req.body.content,
        done: false
    })
    newTodo.save(function(err, todo){
        if(err){
            res.json({"Error: ": err})
        }else{
            res.json({"Status: ": "Successful", "ObjectId": todo.id})
        }
    })
})
//modifies item in DB
app.put('/', (req, res) => {
    let id = req.body.check;
    let error = {}
    if(typeof id === "string"){
        Todo.updateOne({_id: id}, {done: true}, function(err){
            if(error){
                err = error
            }
        })
    } else if (typeof id === "object") {
        id.forEach( ID =>{
            Todo.updateOne({_id: ID}, {done: true}, function(err){
                if(error){
                    err = error
                }
            })
        })
    }
    if(err){
        res.json({"Error: ": err})
    }else{
        res.json({"Status: ": "Successful"})
    }
})

app.delete('/', (req, res) => {
    let id = req.body.check;
    let error = {}
    if(typeof id === "string"){
        Todo.deleteOne({_id: id}, function(err){
            if(error){
                err = error
            }
        })
    } else if (typeof id === "object") {
        id.forEach( ID =>{
            Todo.deleteOne({_id: ID}, function(err){
                if(error){
                    err = error
                }
            })
        })
    }
    if(err){
        res.json({"Error: ": err})
    }else{
        res.json({"Status: ": "Successful"})
    }
})

app.listen(3000, function(){
    console.log('App listening on port 3000')
})