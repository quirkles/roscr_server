import Server from 'socket.io';


export default () => new Server().attach(8090)
