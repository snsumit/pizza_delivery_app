const Order = require("../../../src/order");
const moment = require("moment");
const stripe = require('stripe')('sk_test_51OyOHKSFqY70DF9FA9gP1zvhEQCoBSeb5hIPfRBNbQc7Exasw12yNbserLYtQZWWwI6rR62CarvFpWmW61Y1ENdS00QTzvMezY');

function orderController() {
    return {
        store(req, res) {
            const { phone, address, stripeToken, paymentType } = req.body;
           
            if (!phone || !address) {
                return res.status(422).json({ message: 'All fields are required' });
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address,
            });

            order.save()
                .then((result) => {
                    Order.populate(result, { path: "customerId" })
                        .then((placeOrder) => {
                            console.log("Populated order:", placeOrder);

                            if (paymentType === "card") {
                                stripe.paymentIntents.create({
                                    amount: req.session.cart.totalPrice * 100,
                                    payment_method_types: ['card'],
                                    payment_method_data: {
                                        type: 'card',
                                        card: {
                                            token: stripeToken
                                        }
                                    },
                                    currency: 'INR',
                                     description: `Pizza Id ${placeOrder._id}`,
                                    confirm:true,
                                   
                                }).then(() => {
                                    placeOrder.paymentStatus = true;
                                    placeOrder.paymentType = paymentType;
                                    placeOrder.save().then((ord) => {
                                        delete req.session.cart;
                                        return res.json({ message: 'Payment Successful. Order Placed successfully' });
                                    }).catch((err) => {
                                        console.error("Error saving order:", err);
                                        return res.json({ message: 'Something went wrong' });
                                    });
                                }).catch((err) => {
                                    console.error("Error processing payment:", err);
                                    
                                    return res.json({ message: 'Payment failed. You can pay at delivery time' });
                                });
                            }else{
                                delete req.session.cart;
                                return res.json({message :'Order Place Successfully'});
                            }
                        }).catch((err) => {
                            console.error("Error populating order:", err);
                            return res.json({ message: 'Something went wrong' });
                        });
                }).catch((err) => {
                    console.error("Error saving order:", err);
                    return res.json({ message: 'Something went wrong' });
                });
        },

        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } });
            res.render("order", { orders: orders, moment: moment });
        },

        async show(req, res) {
            const order = await Order.findById(req.params.id);

            // Authorize user
            if (req.user._id.toString() === order.customerId.toString()) {
                return res.render('singleOrder', { order });
            }
            return res.redirect('/');
        }
    };
}

module.exports = orderController;
