function cartController(){
    return{
        index:function(req,res){
              res.render("cart");
        },
        update:function(req, res) {
           
            let PizzaId = req.body._id;
            
            // Creating the cart for the first time
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                };
            }
        
            let cart = req.session.cart;
        
            // If the item does not exist in the cart, add it
            if (!cart.items[PizzaId]) {
                cart.items[PizzaId] = {
                    item: req.body,
                    qty: 1
                };
            } else {
                // If the item already exists, increment its quantity
                cart.items[PizzaId].qty++;
            }
        
            // Update totalQty and totalPrice
            cart.totalQty++;
            cart.totalPrice += req.body.price;
            
        return res.json({ totalQty:req.session.cart});
        }
        
}
}
module.exports = cartController