const LocalStartegy = require("passport-local").Strategy;
const User = require("../../src/user");
const bcrypt = require("bcrypt");

 function init(passport) {
     passport.use(new LocalStartegy({ usernameField: 'email' }, async (email, password, done) => {

        // check if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return done(null, false, { message: "No user with this email" });
        }
        //  compare password
        bcrypt.compare(password, user.password).then((match) => {
            if (match) {
                return done(null, user, { message: "login successfully" })
            }

            return done(null, false, { message: "Worng username or password" })
        }).catch(err => {
            return done(null, false, { message: "something went wrong" });
        })

    }))

    passport.serializeUser((user,done)=>{
        done(null,user._id);
    })
    passport.deserializeUser(async (id,done)=>{
        try{
          const user = await User.findById(id);
          done(null,user)
        }catch(error){
            done(error,null);
        }
        
    
    })
}

module.exports = init