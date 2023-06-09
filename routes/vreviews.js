const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controllers/vreviews');
const { validateReview, isLoggedIn, isvReviewAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');

const ExpressError = require('../utils/ExpressError');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isvReviewAuthor, catchAsync(reviews.deleteReview))
module.exports = router;