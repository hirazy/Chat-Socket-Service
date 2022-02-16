require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

import { awsBucketName, awsBucketRegion, awsAccessKey, awsSecretKey } from '../../config'

const s3 = new S3({
    awsBucketRegion,
    awsAccessKey,
    awsSecretKey
})

function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile


// downloads a file from s3
function getFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream()
}
exports.getFileStream = getFileStream