import { Router } from 'express'
import { success, notFound } from '../../services/response/'
import { password, master } from '../../services/passport'

const multer = require('multer');
const upload = require('../uploadMiddleware');
const Resize = require('../Resize');
const path = require('path');

const router = new Router()

// var storage = multer.diskStorage({
//     destination: function(req, file, cb) {

//         // Uploads is the Upload_folder_name
//         cb(null, '/uploads')
//     },
//     filename: function(req, file, cb) {
//         cb(null, file.fieldname + "-" + Date.now() + ".jpg")
//     }
// })

// // Define the maximum size for uploading
// // picture i.e. 1 MB. it is optional
// const maxSize = 1 * 1000 * 1000;

// var upload = multer({
//     storage: storage,
//     limits: { fileSize: maxSize },
//     fileFilter: function(req, file, cb) {

//         // Set the filetypes, it is optional
//         var filetypes = /jpeg|jpg|png/;
//         var mimetype = filetypes.test(file.mimetype);

//         var extname = filetypes.test(path.extname(
//             file.originalname).toLowerCase());

//         if (mimetype && extname) {
//             return cb(null, true);
//         }

//         cb("Error: File upload only supports the " +
//             "following filetypes - " + filetypes);
//     }

//     // mypic is the name of file attribute
// }).single("mypic");

/**
 * @api {post} /image Upload image
 * @apiName Authenticate
 * @apiGroup Auth
 * @apiPermission master
 * @apiHeader {String} Authorization Basic authorization with email and password.
 * @apiParam {String} access_token Master access_token.
 * @apiSuccess (Success 201) {String} token User `access_token` to be passed to other requests.
 * @apiSuccess (Success 201) {Object} user Current user's data.
 * @apiError 401 Master access only or invalid credentials.
 */
router.post('/', master(), upload.single('image'), async(req, res) => {

    const imagePath = path.join(__dirname, '/uploads');
    console.log(imagePath)
        // call class Resize
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
        res.status(401).json({ error: 'Please provide an image' });
    }
    const filename = await fileUpload.save(req.body.image);

    res.status(200).json({ name: filename });
})

export default router