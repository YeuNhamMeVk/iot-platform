module.exports  = function(req, res){
	const flash = require('connect-flash')
	const User = require('./../../models/users');

		User.findOne({verifyToken: req.params.token, verifyExpires:{ $gt: Date.now() }},function(err,user){
	        console.log(user)
	        if (!user) {
	        	return res.redirect('/register')
	        } else {
	        user.isVerified = true;
	        user.verifyToken = undefined;
	        user.verifyExpires = undefined;
	        user.save(function(err){
	            if (err) throw err;
	            req.flash('loginMessage','Comfirm success!')
	            res.redirect('/login')

	        });
	    }
	})

}