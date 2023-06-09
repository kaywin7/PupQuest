const Shelter = require('../models/shelter');
const Review = require('../models/review');
module.exports.createReview = async (req, res) => {
    const shelter = await Shelter.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    shelter.reviews.push(review);
    await review.save();
    await shelter.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/shelters/${shelter._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Shelter.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/shelters/${id}`)
}