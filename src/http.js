import axios from 'axios';

export default (url) => axios
  .get(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, { timeout: 10000 })
  .then((response) => response);
