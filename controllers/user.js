const User = require('../models/user');

module.exports.getRegisterForm = (req, res) => {
    res.render('user/register');
}

module.exports.registerUser = async(req, res, next) => {
    try {
        const { email, username, pw } = req.body;
        console.log(`${username}, ${email}, ${pw}`);
        const user = await new User({email, username});
        const regUser = await User.register(user, pw);
        console.log(regUser);
        req.login(regUser, e => {
            if (e)
                next(e);
            req.flash('success', 'Welcome to YelpCamp');
            return res.redirect('/campgrounds');
        })
    } catch (e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.login = (req, res) => {
    const returnUrl = res.locals.returnTo || '/campgrounds';
    console.log(res.locals.returnTo);
    req.flash('success', 'Welcome back!');
    res.redirect(returnUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((e) => {
        if (e)
            return next();
    });
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
}