const passport = require("passport");
const User = require("../../../src/user");
const bcrypt = require("bcrypt");

const authController = () => {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/orders'
    }
    
    return {
        login: function (req, res) {
            res.render("login");
        },
         register:function(req,res){
            res.render("register")
        },
        async postRegister(req,res){
            const {name , email , password} = req.body;
            
            if(!name || !email || !password){
                req.flash("error","All fields are required");
                req.flash("name",name);
                req.flash("email",email);
                return res.redirect("/register")
            }
            // check if user exists
            User.exists({email:email}).then((result)=>{
                if(result){
                    req.flash("error","Email Already Taken");
                req.flash("name",name);
                req.flash("email",email);
                return res.redirect("/register")
                }
            })
            // hash password
               const hashPassword = await bcrypt.hash(password,10);
            // create user
            let user = new User({
                name,
                email,
                password:hashPassword,
            })

            user.save().then((user)=>{
                res.redirect("/");
            }).catch(err =>{
            req.flash("error","Something went wrong");
            res.redirect("/register");
            })
        },
        postlogin(req,res,next){
            const {email , password} = req.body;
            if(!email || !password){
                req.flash("error","All fields are required");
                res.redirect("/login")
            }
             
             passport.authenticate("local",(err,user,info)=>{
                if(err){
                    req.flash("error",info.message)
                    return next(err);
                }
                if(!user){
                    req.flash("error",info.message)
                    return res.redirect("/login");
                }

                req.login(user,(err)=>{
                   if(err){
                    req.flash("error",info.message);
                    return next(err);
                   }
                   return res.redirect(_getRedirectUrl(req))
                })
             })(req,res,next)
        },
        logout(req,res){
            req.logout((result)=>{
                
            });
            return res.redirect("/");
        }
    }
}

module.exports = authController;

