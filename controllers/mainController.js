exports.getIndex = (req,res,next) => {
        res.render('home/welcome', {
            pageTitle: 'Welcome',
        });

}
