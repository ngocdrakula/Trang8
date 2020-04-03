import io from 'socket.io-client';
import origin from './origin';
const socket = io(origin);


export default socket;