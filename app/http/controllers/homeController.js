const Menu = require("../../../src/menu");


const homeController = () =>{
   return{
       index:async function(req,res){
          const pizzas = await Menu.find() 
          return  res.render("home",{pizzas:pizzas})
      }
   }  
}

module.exports =homeController;