module.exports = function(req, res, User){
	   	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    	if (!user) {
      	return res.redirect('/forgot-password');
    };
    res.render('pages/reset-password',{title:'New password',message:req.flash('message')});
})
}