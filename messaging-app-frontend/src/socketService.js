// socketService.js
import io from 'socket.io-client';
// Service to manage the socket connection in various parts of application
class SocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        console.log(process.env.REACT_APP_API_URL);
        this.socket = io(process.env.REACT_APP_API_URL,{
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
          });
    }
}

const socketService = new SocketService();
export default socketService;