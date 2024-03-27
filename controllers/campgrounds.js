const Campground = require('../models/campgrounds');
const mongoose = require('mongoose');

module.exports.index = async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', {camps});
}

module.exports.createCampground = async(req, res) => {
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', "Successfully created campground!");
    res.redirect(`/campgrounds/${newCamp._id}`);
}

module.exports.newCampgroundForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.showCampground = async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) { // the function we need to write
        res.status(200).send("Invalid params"); // you can define your status and message
        return;
     }
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        console.log("entered");
        req.flash('error', "Could not find campground");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}

module.exports.editCampground = async(req, res) => {
    let { id } = req.params;
    camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', "Successfully updated campground!");
    res.redirect(`/${camp._id}`);
}

module.exports.getEditCampgroundForm = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp) {
        req.flash('error', "Could not find campground");
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {camp});
}

module.exports.deleteCampground = async(req, res) => {
    let {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}