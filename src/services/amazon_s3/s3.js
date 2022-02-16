const env = require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

import { awsBucketName, awsBucketRegion, awsAccessKey, awsSecretKey } from '../../config'

const s3 = new S3({
    region: awsBucketRegion,
    accessKeyId: awsAccessKey,
    accessSecretKey: awsSecretKey
})

// upload a file to s3
function uploadFile(path, name) {

    const fileStream = fs.createReadStream(path)

    console.log(awsBucketName + " " + awsBucketRegion + " " + awsAccessKey + " " + awsSecretKey)

    const uploadParams = {
        Bucket: awsBucketName,
        Body: fileStream,
        Key: "cat.jpg"
    }

    return s3.upload(uploadParams).promise()
}

exports.uploadFile = uploadFile

// downloads a file from s3
function getFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: awsBucketName
    }

    return s3.getObject(downloadParams).createReadStream()
}
exports.getFileStream = getFileStream