//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

//   Connect and create databes Users
mongoose.connect("mongodb://localhost:27017/Users",{useNewUrlParser: true, useUnifiedTopology: true});

// create Schema and module
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


// const secret = "ThisistheencryptionIUse.";
userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);


app.get('/', function(req, res){
    res.render("home");
})

app.route("/register")
.get(function(req, res){
    res.render("register");
})
.post(function(req, res){
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
            console.log("New user has been successffuly added");
        }
    });
    
});

app.route("/login")
.get(function(req, res){
    res.render("login");
})
.post(function(req, res){
    User.findOne({email: req.body.username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password == req.body.password){
                    res.render("secrets");
                    console.log("User Login successfully");
                }
            }
            
        }
    })
});



app.get("/login", function(req, res){
    res.render("login");
})



app.listen(3000, function(req, res){
    console.log('server is raninning en port 3000');
})