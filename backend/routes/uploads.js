const express = require('express');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const router = express.Router();
const multer = require('multer');
const isAuth = require('../middlewares/isAuth');
const { uploadFile, getFileStream } = require('../utils/s3');
const path = require("path");

// @route   POST /upload/image
// @desc    Upload product images
// @access  protected
router.post('/image', isAuth, async (req, res) => {
  const { image } = req.files;
  image.mv(__dirname + '/../public/' + image.name);
  const imageUrl = `http://localhost:${process.env.PORT || 5000}/${image.name}`;
  try {
    res.status(200).json({ imagePath: imageUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: { msg: 'Server error' } });
  }
});

// @route   GET /upload/image/:key
// @desc    Get image with key
// @access  protected
router.get('/image/:key', async (req, res) => {
  try {
    const fileBuffer = await getFileStream(req.params.key);

    res.status(200).send(fileBuffer);
    // readStream.pipe(res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: { msg: 'Server error' } });
  }
});

module.exports = router;
