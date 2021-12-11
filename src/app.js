import http from 'http'
import { env, mongo, port, ip, apiRoot } from './config'
import mongoose from './services/mongoose'
import express from './services/express'
import api from './api'
const User = require('./api/user/model')
const Message = require('./api/message/model')
const Room = require('./api/room/model')

const ObjectId = require('mongodb').ObjectID

const app = express(apiRoot, api)
const server = http.createServer(app)

if (mongo.uri) {
    mongoose.connect(mongo.uri)
}
mongoose.Promise = Promise

setImmediate(() => {
    server.listen(port, ip, () => {
        console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
    })
})

let io = require("socket.io")(server);

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

    })

    /**
     * 
     * TODO: Logout 
     */
    socket.on('log_out', (data) => {
        // Set id socket empty
        socket.id = ''

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
     * @param{
     *      roomID: String,
     *      
     * }
     * 
     * TODO: Fetch Message
     */
    socket.on('fetch_message', async(data) => {
        var roomID = data.roomID

        // Find room by ID
        let room = await Room.findOne({ _id: roomID }, {});

        /**
         * Room found
         */
        if (room) {
            socket.emit('')

        } else {
            socket.emit('')
        }
    })

    /**
     * @implements receive send from Client, save to database and send notification to receiver 
     * @param{
     *  roomID      : String,
     *  receiverID  : String,
     *  senderID    : String,
     *  content     : bool,
     *  isImage     : bool      
     * } message
     * 
     * TODO: Send Message to receiver
     */
    socket.on('send_message', async(message) => {
        let defaultRoomID = ''

        let receiverID = message.receiverID
        let senderID = message.senderID
        let content = message.content
        let isImage = message.isImage

        // ID of room contain message
        let roomID = message.roomID

        let newMessage = {
            sender: senderID,
            receiver: receiverID,
            content: content,
            isImage: false
        }

        /**
         * ? Room not be created
         */
        if (roomID === defaultRoomID) {
            /// Initialize new room to insert message
            let newRoom = {
                    users: [senderID, receiverID],
                    message: [newMessage]
                }
                /// Create new Room
            var createRoom = Room.insertOne(newRoom)

            /// Create room successfully
            if (createRoom) {
                /// ID Room 
                let newRoomID = createRoom.insertedId

                let dataRoom = { roomID: newRoomID, users: [senderID, receiverID], message: newMessage }

                /// Send to client
                socket.emit('send_message_successfully', dataRoom)

                /// Send to client of friends
                /**
                 * @emits receive_message
                 */
                io.to(receiverID).emit('receive_message', dataRoom)
            }
        } else {
            // Insert message
            Room.findById(roomID, async(err, room) => {
                if (err) {
                    throw err;
                }

                // Update Messages - Push message to messages of Room
                let res = await Room.updateOne({ _id: ObjectId(roomID) }, { $push: { messages: newMessage } })

                // Update Successfully
                if (res) {

                    let dataMessage = { roomID: roomID, users: [senderID, receiverID], message: newMessage }

                    /// Send to client - sender
                    socket.emit('send_message_successfully', dataMessage)

                    /// Send to client of friends - receiver
                    /**
                     * @emits receive_message
                     */
                    io.to(receiverID).emit('receive_message', dataMessage)
                }
            })
        }
    })

    /**
     * @implements
     * 
     * @param{
     *      roomID: String,
     *      content: String
     *      senderID: String,
     *      receiverID: String,
     *      isImage: String
     * }
     * 
     * TODO: Send message image
     */
    socket.on('upload_image', async(data) => {
        let receiverID = data.receiverID
        let senderID = data.senderChatID
        let content = data.content
        let isImage = data.isImage

    })

    /**
     * @implements
     * @param{
     *      receiverID: String
     * }
     */
    socket.on('add_writing', (data) => {

        var res = {

        }

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

        var res = {

        }

        socket.emit('receive_remove_writing', res)
    })

    /**
     * @implements
     * 
     * @param{
     *      roomID: String
     *      content: String,
     *      senderID: String,
     *      receiverID: String,
     *      isImage: Boolean
     * } data
     * 
     * TODO: Receive event from io and send event new message to 
     * 
     */
    socket.on('receive_message', (data) => {

        let message = {
            roomID: data.roomID,
            content: data.content,
            senderID: data.senderID,
            receiverID: data.receiverID,
            isImage: data.isImage
        }

        // Send event new message to Client
        socket.emit('new_message', message)
    })

    /**
     * DISCONNECT
     */
})


/**
 * @param {String} content 
 * @param {String} senderID 
 * @param {String} receiverID 
 * @param {bool} isImage 
 */
function saveMessage(content, sender, receiver, isImage = false) {
    var message = new Message(content, sender, receiver, isImage)

    Message.findOne({ _id: sender }, (err, doc) => {
            if (!doc) {
                message.save()
            } else {
                var receiverIndex = doc.users.findIndex(element => element._id === receiver)

                if (receiverIndex != undefined && receiverIndex != -1) {

                }
            }
        })
        .catch((err) => {

        })
}

export default app