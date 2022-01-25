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

const io = require("socket.io")(server);

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
    socket.on('log_out', (data) => {
        // Set id socket empty
        socket.id = ''

        socket.join('')
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

        await Room.findOne({ _id: ObjectId(roomID) }, (err, room) => {
                /// Found Room
                let messageData = {
                    senderID: senderID,
                    content: content,
                    isImage: isImage,
                }

                let roomData = {
                    id: roomID,
                    name: room.name,
                    picture: room.picture
                }

                let dataMessage = { room: roomData, message: messageData }

                if (roomID == "61d5204483cef30016d260f6") {
                    /// Send all to Server
                    io.sockets.emit('receive_message', dataMessage)
                } else {

                    for (let i = 0; i < room.users.length; i++) {

                        /// Send to id of socket - users in room
                        io.to(room.users[i]).emit('receive_message', dataMessage)
                    }

                    /// Send to client - sender
                    socket.emit('send_message_successfully', dataMessage)

                    /// Send to client of friends - receiver
                    /**
                     * @emits receive_message
                     */
                    // io.to(receiverID).emit('receive_message', dataMessage)
                }
            })
            .catch((err) => {

            })
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