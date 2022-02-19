import http from 'http'
import { env, mongo, port, ip, apiRoot } from './config'
import mongoose from './services/mongoose'
import express from './services/express'
import api from './api'
import { getMessaging } from "firebase/messaging";

import User, { schemaUser } from './api/user/model'
import Room, { schemaRoom } from './api/room/model'

const ObjectId = require('mongodb').ObjectID

const app = express(apiRoot, api)
const server = http.createServer(app)

// IO
const io = require("socket.io")(server);

// Admin Firebase
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const deviceTest = 'd1l_T_hOSnK-OVtrs4_fCs:APA91bGq4E7k_pI6SpYvn-INZJzxHJgaivQo4iK5EXUqbmUhhIAbdlF3NpIusnR81lxhwylHWx5wN28RoMC4KXddEM0X3RccI3JUk1NYycTJp1Hml_NawdKmfPPUFMZgY_h9nvZRkxnX'

// Server Key Firebase
const server_key = 'AAAAwpR-8BI:APA91bGu43MO0MRqIDflM6CmPB-5-zVC-IUXmcIYk6mjAVo-vphgNbUkf_j1fPsqcL1RcVMhuZIKIVJDFgTtcLaiG4ahr-LGGzRDGhUNn83MFK2-_TcL2m3x2gufdwaz80mofNUqsefx'

if (mongo.uri) {
    mongoose.connect(mongo.uri)
}
mongoose.Promise = Promise

setImmediate(() => {
    server.listen(port, ip, () => {
        console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
    })
})

// const io = require('socket.io').listen(server)


/**
 * @param {senderID, receiverID, roomID, isImage, content}
 * TODO: sign_in, sign_up, log_out, fetch_shuffle, chatID, fetch_message, send_message
 */

io.on('connection', function(socket) {

    /**
     * TODO: Event Connect Socket
     */
    socket.on('connect', (data) => {
        console.log("Socket Connect")
    })

    /**
     * @param{id: String} data
     * 
     * TODO: Event Login => change socketID
     */
    socket.on('login', (data) => {
        /**
         * Change Socket ID
         */
        socket.id = data.id

        socket.join(data.id)

        /// Log ID Socket
        console.log("Socket ID " + socket.id)
    })

    /**
     * 
     * TODO: Logout 
     */
    socket.on('logout', (data) => {

        console.log('Logout ' + socket.id)

        // Set id socket empty
        socket.id = ''

        // Socket disconnect
        socket.disconnect()
    })

    /**
     * Fetch Shuffle on user
     * 
     * TODO: Get Shuffle
     */
    socket.on('fetch_shuffle', (data) => {

    })

    /**
     * @param{id: String} data
     * 
     * TODO: 
     */
    socket.on('chatID', (data) => {
        let chatID = data.id
        socket.join(chatID)

        console.log('chatID')

        socket.on('disconnect', function() {
            // let rooms = socket.room
            socket.leave(chatID)
        })
    })

    /**
     * @implements receive send from Client, save to database and send notification to receiver 
     * @param{
     *  roomID      : String,
     *  senderID    : String,
     *  content     : bool,
     *  isImage     : bool      
     * } message
     * 
     * TODO: Send Message to receiver
     */
    socket.on('send_message', async(message) => {

        let senderID = message.senderID
        let roomID = message.roomID
        let content = message.content
        let isImage = message.isImage

        console.log("Send Message " + senderID)

        let messageData = {
            'roomID': roomID,
            'content': content,
            'senderID': senderID,
            'isImage': isImage.toString()
        }

        let notification = {
            notification: {
                title: 'Message from node',
                body: content
            },
            data: messageData
        };

        const notification_options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };

        if (roomID == '61d5204483cef30016d260f6') {

            let device_tokens = []

            // Get All Users
            let users = await User.find({})

            // Send to All Users
            for (let i = 0; i < users.length; i++) {

                // Device Token
                let device_token = users[i].device_token

                console.log("Sender ID " + senderID + " User ID " + users[i]._id)

                if (device_token != '' && senderID !== users[i]._id) {
                    device_tokens.push(device_token)
                }
            }

            await admin.messaging().sendToDevice(device_tokens, notification, notification_options).then((response) => {
                    // console.log(response)
                })
                .catch((err) => {
                    console.log(err)
                })

        } else {
            /**
             * @param 
             * _id: String
             * messages: []
             * name: String
             * picture: String
             * users: []
             * createdAt: Time
             * updatedAt: Time
             */
            var roomData = await Room.findOne({ _id: ObjectId(roomID) })

            // Get info 
            if (roomData != null) {

                // Id of users in room
                let users = roomData.users

                let device_tokens = []

                for (let i = 0; i < users.length; i++) {

                    /**
                     * @param 
                     * _id: String
                     * role: [users, admin]
                     * picture: String
                     * name: String
                     * email: String
                     * password: String
                     * createdAt: Time
                     * updatedAt: Time
                     */

                    let user = await User.findOne({ _id: ObjectId(users[i]) })

                    if (user.device_token != '' && senderID != users[i]._id) {
                        device_tokens.push(user.device_token)
                    }
                }

                await admin.messaging().sendToDevice(device_tokens, notification, notification_options).then((response) => {
                        console.log("Result Messaging" + response)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }

        }
    })

    /**
     * @implements
     * 
     * @param{
     * room: {
     *  id: String,
     *  name: String,
     *  picture: String             
     * }
     * 
     * message: {
     *  senderID: String,
     *  content: String,
     *  isImage: bool
     * }     
     *      
     * } data
     * 
     * TODO: Receive event from io and send event new message to 
     * 
     */
    socket.on('receive_message', (data) => {

        // Send event new message to Client
        socket.emit('receive_message', data)
    })

    /**
     * @implements
     * @param{
     *      receiverID: String
     * }
     */
    socket.on('add_writing', (data) => {

        var res = {}

        io.to(receiveID).emit('receive_add_writing', res)
    })

    /**
     * @implements
     * @param{
     *      receiveID: String
     * }
     */
    socket.on('remove_writing', (data) => {

        var res = {
            receiveID: data.receiveID
        }

        // 
        io.to(receiveID).emit('receive_remove_writing', res)
    })

    /**
     * @param{
     *      receiverID: String
     *      
     * }
     */
    socket.on('receive_add_writing', (data) => {
        var res = {
            receiveID: data.receiverID
        }

        socket.emit('receive_add_writing', res)
    })

    /**
     * @param{
     *      receiverID: String
     * }
     */
    socket.on('receive_remove_writing', (data) => {

        var res = {}

        socket.emit('receive_remove_writing', res)
    })

    /**
     * DISCONNECT
     */
    socket.on('disconnect', (data) => {

    })

})

export default app