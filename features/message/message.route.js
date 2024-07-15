import socketController from '../message/message.controller.js';

const socketRoutes = (io) => {
    io.on('connection', socket => {
        socketController(socket);
    });
};

export default socketRoutes;