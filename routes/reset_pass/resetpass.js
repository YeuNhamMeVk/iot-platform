module.exports = function(req,res,User){
	async = require('async')
	bcrypt = require('bcrypt-nodejs')

	async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          res.redirect('/');
        }
        var repass = req.body.password;
        
        user.password = bcrypt.hashSync(repass, bcrypt.genSaltSync(8), null);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
  	], 
  	function(err) {
    res.redirect('/login');
  })
}