module.exports = (req,res,next) => {
    if(!req.session.isUserLoggedIn) {
        return res.redirect('/user/login');
    }
    next();
}