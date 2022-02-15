const env = require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

import { awsBucketName, awsBucketRegion, awsAccessKey, awsSecretKey } from '../../config'

const s3 = new S3({
    awsBucketRegion,
    awsAccessKey,
    awsSecretKey
})

// upload a file to s3
export function uploadFile(path, name) {
    const fileStream = fs.createReadStream(path)

    const uploadParams = {
        Bucket: awsBucketName,
        Body: fileStream,
        Key: name
    }

    return s3.upload(uploadParams).promise()
}

exports.uploadFile = uploadFile


// downloads a file from s3

// downloads a file from s3
function getFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream()
}
exports.getFileStream = getFileStream