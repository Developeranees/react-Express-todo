const express = require('express')
const mongoose = require('mongoose')
const path = require('path');


// Initialization


const app = express()
app.use(express.json())


// Schema Mongoose

const Schema = mongoose.Schema;

const todoSchema =  Schema({
    todo : {
        type: String,
        required : true
    }
},{timestamps : true})


const Todo = mongoose.model('todo',todoSchema)


// Api's

// React Serve

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// Get Request

app.get('/get_todo',(req,res)=>{
    Todo.find().then((data)=>{
        res.json(data)
    })
})

// Post Req


app.post('/add_todo',(req,res) => {
    
    const {todo} = req.body;

    const todos = {todo}

    const newTodo = new Todo(todos)

    newTodo.save().then(()=>{
        res.send('Todo Added')
    }).catch((e)=>{
        res.status(400).json(e)
    })

})

// Delete Req
app.delete('/delete_todo/:id',(req,res)=>{
    Todo.findByIdAndDelete({ _id : req.params.id }).then(()=>{
        res.send('User Deleted')
    })

})

// Put Request


app.put('/update_todo/:id',(req,res)=>{
    const {todo} = req.body;

    Todo.findByIdAndUpdate({ _id : req.params.id } , {todo}).then(()=>{
        res.send('User Updated')
    })
})

// Mongoose Connect

mongoose.connect('mongodb://localhost:27017/todo',{useNewUrlParser : true , useUnifiedTopology: true ,'useFindAndModify': false}).then(()=>{
    console.log('DB Connected')
})
// Listen

const PORT = process.env.PORT || 4000;
app.listen(PORT , ()=>{
    console.log('Server is Listening On Port : ' + PORT)
})




