import axios from 'axios';

const api = axios.create({
	baseURL: 'https://plant-manager-api.herokuapp.com/'
});

export default api;