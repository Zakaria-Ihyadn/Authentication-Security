//jshint esversion:6
// require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption'); Level 2
// const md5 = require('md5'); Level 3
const bcrypt = require('bcryptjs'); // Level 4
const saltRounds = 10;



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

/* Using encrypting level 2*/ 
// const secret = "ThisistheencryptionIUse.";
// userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);


app.get('/', function(req, res){
    res.render("home");
})

app.route("/register")
.get(function(req, res){
    res.render("register");
})
.post(function(req, res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        const newUser = new User({
            email : req.body.username,
            password : hash
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
                bcrypt.compare(req.body.password, foundUser.password /*Hash*/, function(err, result){
                    if(result === true){
                        res.render("secrets");
                    }
                })
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