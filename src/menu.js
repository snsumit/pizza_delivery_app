const mongoose = require('mongoose');

const Schema  = mongoose.Schema

const MenuSchema = new Schema({
    name:{
        type:String,
        require:true,
    },
    image:{
         type:String,
         require:true,
    },
    price :{
       type:Number,
       require:true,
    },
    size:{
        type:String,
        require:true,
    }
})

const Menu = mongoose.model("Menu",MenuSchema);

module.exports= Menu;