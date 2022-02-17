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
    console.log(req.params.path)
    const key = req.params.path
    const readStream = getFileStream(key)

    readStream.pipe(res)
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

    const file = req.file

    //console.log(file['type'])

    // if (!file || file['mimetype'].split('/')[0] !== 'image') {
    //     res.status(401).json({ error: 'Please provide an image' });
    // } else {

    console.log(file)

    const result = await uploadFile(file)
    console.log("Amazon S3 " + result)

    await unlinkFile(file.path)
    console.log(result)
    const description = req.body.description

    res.status(200).json({ name: result.Key });
    // }
})

export default router