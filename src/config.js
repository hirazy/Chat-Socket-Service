/* eslint-disable no-unused-vars */
import path from 'path'
import merge from 'lodash/merge'

/* istanbul ignore next */
const requireProcessEnv = (name) => {
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable')
    }
    return process.env[name]
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv-safe')
    dotenv.config({
        path: path.join(__dirname, '../.env'),
        example: path.join(__dirname, '../.env.example')
    })
}

const config = {
    all: {
        env: process.env.NODE_ENV || 'development',
        root: path.join(__dirname, '..'),
        port: process.env.PORT || 9000,
        ip: process.env.IP || '0.0.0.0',
        apiRoot: process.env.API_ROOT || '',
        defaultEmail: 'chatappservice123@gmail.com',
        sendgridKey: requireProcessEnv('SENDGRID_KEY'),
        masterKey: requireProcessEnv('MASTER_KEY'),
        jwtSecret: requireProcessEnv('JWT_SECRET'),
        awsBucketName: requireProcessEnv('AWS_BUCKET_NAME'),
        awsBucketRegion: requireProcessEnv('AWS_BUCKET_REGION'),
        awsAccessKey: requireProcessEnv('AWS_ACCESS_KEY'),
        awsSecretKey: requireProcessEnv('AWS_SECRET_KEY'),
        mongo: {
            options: {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true
            }
        }
    },
    test: {},
    development: {
        mongo: {
            uri: 'mongodb://localhost/server-chatapp-dev',
            options: {
                debug: true
            }
        }
    },
    production: {
        ip: process.env.IP || undefined,
        port: process.env.PORT || 8080,
        mongo: {
            uri: process.env.MONGODB_URI || 'mongodb://localhost/server-chatapp'
        }
    }
}

module.exports = merge(config.all, config[config.all.env])
export default module.exports