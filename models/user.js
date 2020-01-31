const mongoose = require('mongoose');

//User Schema
const UserSchema = mongoose.Schema({


  name:{
    type: String,
    require: true
  },
  email:{
    type: String,
    require: true
  },
  username:{
    type: String,
    require: true
  },
  password:{
    type: String,
    require: true
  }
});

const user = module.exports = mongoose.model('User', UserSchema) ;
