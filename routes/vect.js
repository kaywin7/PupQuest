const express = require('express');
const router = express.Router();
const vects = require('../controllers/vect');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isvAuthor, validateVect } = require('../middleware');
const Vect = require('../models/vect');
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(vects.index))
    .post(isLoggedIn, upload.array('image'), validateVect, catchAsync(vects.createVect))


router.get('/new', isLoggedIn, vects.renderNewForm);
router.route('/:id')
    .get(catchAsync(vects.showVect))
    .put(isLoggedIn, isvAuthor, upload.array('image'), validateVect, catchAsync(vects.updateVect))
    .delete(isLoggedIn, isvAuthor, catchAsync(vects.deleteVect))
router.get('/:id/edit', isLoggedIn, isvAuthor, catchAsync(vects.renderEditForm))
module.exports = router;