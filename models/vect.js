const mongoose = require('mongoose');
const vReview = require('./vreview');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
const opts = { toJSON: { virtuals: true } };
const VectSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    doctor: String,
    description: String,
    location: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'vReview'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts);
VectSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/shelters/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

VectSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await vReview.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Vect', VectSchema);