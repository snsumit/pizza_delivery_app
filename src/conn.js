const mongoose = require("mongoose");

const url ='mongodb://127.0.0.1:27017/pizza'

mongoose.connect(url).then(()=>{
    console.log("database connected")
}).catch((err)=>{
    console.log(err)
})

