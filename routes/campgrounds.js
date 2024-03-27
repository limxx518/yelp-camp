const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campground = require('../controllers/campgrounds.js');
const { isLoggedIn, validateCampgroundSchema, isAuthor} = require('../middleware.js');

router.get('/', catchAsync(campground.index));

router.post('/', isLoggedIn, validateCampgroundSchema,
    catchAsync(campground.createCampground));

router.get('/new', isLoggedIn, campground.newCampgroundForm);

router.get('/:id', catchAsync(campground.showCampground));

router.put('/:id/', isLoggedIn, isAuthor, validateCampgroundSchema,
    catchAsync(campground.editCampground));

router.get('/:id/edit', isLoggedIn, isAuthor,
    catchAsync(campground.getEditCampgroundForm));

router.delete('/:id/', isLoggedIn, isAuthor,
    catchAsync(campground.deleteCampground));

module.exports = router;