const Order = require('../../../../src/order');

function statusController(){
    return{
        update(req,res){
           Order.updateOne({_id : req.body.orderId},{status:req.body.status}).then((err,data)=>{
            if(err){
                return res.redirect('/admin/orders');
            }
            
                  
              return res.redirect('/admin/orders');
            
           })
        }
    }
}
module.exports = statusController;