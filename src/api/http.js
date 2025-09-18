
import axios from 'axios';

const http = axios.create({
    baseURL: 'https://localhost:44334',
    withCredentials: true,
});

export default http;
