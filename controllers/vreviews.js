const Vect = require('../models/vect');
const Review = require('../models/vreview');
module.exports.createReview = async (req, res) => {
    const vect = await Vect.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    vect.reviews.push(review);
    await review.save();
    await vect.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/vects/${vect._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Vect.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/vects/${id}`)
}