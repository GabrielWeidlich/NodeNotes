module.exports = {
    eAdmin: function (req, res, next) {
        if (req.isAuthenticated() && req.user.eAdmin == 1) {
            return next()
        } else {
            req.flash('error', 'You need to be an admin.');
            return res.redirect('/home');
        }
    }
}