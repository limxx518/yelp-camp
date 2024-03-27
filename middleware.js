const Campground = require('./models/campgrounds');
const review = require('./models/review.js');
const Review = require('./models/review.js');
const {campGroundSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // console.log(req.originalUrl);
        req.session.returnTo = req.originalUrl;
        // console.log(req.session);
        req.flash('error', 'You have to log in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampgroundSchema = (req, res, next) => {
    const {err} = campGroundSchema.validate(req.body);
    if (err) {
        const msg = err.details.map(el => el.message).join();
        throw new ExpressError(msg, 400);
    } else
        next();
}
module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', "You do not have permission to do this!");
        res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {err} = reviewSchema.validate(req.body);
    if (err) {
        const msg = err.details.map(el => el.message).join();
        throw new ExpressError(msg, 400);
    } else
        next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do this!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
