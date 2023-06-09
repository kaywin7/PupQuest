const Vect = require('../models/vect');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");
module.exports.index = async (req, res) => {
    const vects = await Vect.find({});
    res.render('vects/index', { vects })
};

module.exports.renderNewForm = (req, res) => {
    res.render('vects/new');
};

module.exports.createVect = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.vect.location,
        limit: 1
    }).send()
    // res.send(geoData.body.features[0].geometry.coordinates);
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const vect = new Vect(req.body.vect);
    vect.geometry = geoData.body.features[0].geometry;
    vect.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    vect.author = req.user._id;
    await vect.save();
    console.log(vect);
    req.flash('success', 'Successfully made a new Vect!');
    res.redirect(`vects/${vect._id}`)
}

module.exports.showVect = async (req, res,) => {
    const vect = await Vect.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(vect)
    if (!vect) {
        req.flash('error', 'Cannot find that Vect!');
        return res.redirect('/vects');
    }
    res.render('vects/show', { vect });
}

module.exports.renderEditForm = async (req, res) => {
    const vect = await Vect.findById(req.params.id)
    if (!vect) {
        req.flash('error', 'Cannot find that vects!');
        return res.redirect('/vects');
    }
    res.render('vects/edit', { vect });
}
module.exports.updateVect = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.vect.location,
        limit: 1
    }).send()
    const { id } = req.params;
    const vect = await Vect.findByIdAndUpdate(id, { ...req.body.vect });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    vect.images.push(...imgs);
    vect.geometry = geoData.body.features[0].geometry;
    await vect.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await vect.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated Vect!');
    res.redirect(`/vects/${vect._id}`)
}
module.exports.deleteVect = async (req, res) => {
    const { id } = req.params;
    await Vect.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Vect')
    res.redirect('/vects');
}