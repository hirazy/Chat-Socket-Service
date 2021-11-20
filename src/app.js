import http from 'http'
import { env, mongo, port, ip, apiRoot } from './config'
import mongoose from './services/mongoose'
import express from './services/express'
import api from './api'
const Message = require('./api/message/model')

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

io.on('connection', function(socket) {

    console.log("SOCKET CONNECTION")

    /**
     * Fetch Shuffle on user
     */
    socket.on('fetch_shuffle', (data) => {

    })

    /**
     * @param{id: String} data
     * 
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


    socket.on('fetch_message', )

    /**
     * @param{
     * receiverChatID: String
     * senderChatID: String,
     * content: bool
     * isImage: bool      
     * } message
     */
    socket.on('send_message', message => {
        let receiverChatID = message.receiverChatID
        let senderChatID = message.senderChatID
        let content = message.content
        let isImage = message.isImage



        socket.in(receiverChatID).emit()

        saveMessage(content, senderChatID, receiverChatID, isImage)
    })


    /**
     * DISCONNECT
     */
})


/**
 * @param {String} content 
 * @param {String} sender 
 * @param {String} receiver 
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