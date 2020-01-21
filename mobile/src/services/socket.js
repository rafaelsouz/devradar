import socketio from 'socket.io-client';

const socket = socketio('http://10.0.0.108:3333', {
    autoConnect: false,
});

function connect(latitude, longitude, techs){

    socket.io.opts.query = {
        latitude,
        longitude,
        techs,
    };

    socket.connect();

    socket.on()
};

function disconnect(){
    if (socket.connected){
        socket.disconnect();
    }
};

export {
    connect,
    disconnect,
};