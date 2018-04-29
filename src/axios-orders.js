import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://react-awesome-burger.firebaseio.com/'
});

export default instance;