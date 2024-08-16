import logo from './logo.svg';
import './App.css';
import Routes from './routes';
import socketService from './socketService';


function App() {
  // Connect to the socket server
  socketService.connect();
  // Successful connection event
  socketService.socket.on("connect", () => {
    console.log("Connected to server");
  });
  // Disconnection event
  socketService.socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });
  return (
    <>
      <Routes />
    </>
  );
}

export default App;
