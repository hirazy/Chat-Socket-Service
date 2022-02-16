import { Router } from 'express'
import { success, notFound } from '../../services/response/'
import { password, master } from '../../services/passport'

const fs = require("fs");
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const upload = require('../uploadMiddleware');
const Resize = require('../Resize');
const path = require('path');
const { uploadFile, getFileStream } = require('../../services/amazon_s3/s3')

const router = new Router()

/**
 * @api {post} /image Upload image
 * @apiName Upload Image
 * @apiGroup Image
 * @apiPermission master
 * @apiHeader {String} Upload image to folder /uploads 
 * @apiParam {String} access_token Master access_token.
 * @apiSuccess (Success 201) {String} name of saved file to be passed to other requests.
 * @apiSuccess (Success 201) {Object} user Current user's data.
 * @apiError 401 Master access only or invalid credentials.
 */
router.get('/:path', (req, res) => {
    var action = req.params.path;

    var filePath = path.join(__dirname, "/uploads/" + action).split("%20").join(" ");

    console.log("Hello 123 " + filePath)

    // Checking if the path exists
    fs.exists(filePath, function(exists) {
        if (!exists) {
            res.writeHead(404, {
                "Content-Type": "text/plain"
            });
            res.end("404 Not Found");
            return;
        }
        // Extracting file extension
        var ext = path.extname(action);
        // Setting default Content-Type
        var contentType = "text/plain";
        // Checking if the extension of
        // image is '.png'
        if (ext === ".png") {
            contentType = "image/png";
        }
        // Setting the headers
        res.writeHead(200, {
            "Content-Type": contentType
        });
        // Reading the file
        fs.readFile(filePath, (err, content) => {
            // Serving the image
            res.end(content);
        });
    });
})

/**
 * @api {post} /image Upload image
 * @apiName Upload Image
 * @apiGroup Image
 * @apiPermission master
 * @apiHeader {String} Upload image to folder /uploads 
 * @apiParam {String} access_token Master access_token.
 * @apiSuccess (Success 201) {String} name of saved file to be passed to other requests.
 * @apiSuccess (Success 201) {Object} user Current user's data.
 * @apiError 401 Master access only or invalid credentials.
 */
router.post('/', master(), upload.single('image'), async(req, res) => {

    const imagePath = path.join(__dirname, '/uploads');
    // // call class Resize
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
        res.status(401).json({ error: 'Please provide an image' });
    } else {
        console.log("File " + req.file)
            // const filename = await fileUpload.save(req.file.buffer);
            // console.log('File Name: ' + filename)

        // Upload Image Amazon S3
        // var filePath = path.join(__dirname, "/uploads/" + filename).split("%20").join(" ");
        const result = await uploadFile(req.file)
        console.log("Amazon S3 " + result)

        await unlinkFile(file.path)
        console.log(result)
        const description = req.body.description

        res.status(200).json({ name: `/images/${result.Key}` });
    }
})

export default router