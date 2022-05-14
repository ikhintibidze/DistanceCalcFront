import axios from 'axios';
import authHeader from './auth-header';


const API_URL = 'http://localhost:8080/api/user/';

class UserService {
  
  getAll() {
    return axios.get(API_URL + 'all', { headers: authHeader() });
  }

  getById(id) {
    return axios.get(API_URL + `${id}`, { headers: authHeader() });
  }

  update (id, data)  {
    return axios.put(API_URL + `${id}`, data, { headers: authHeader() });
  };

  delete (id)  {
    return axios.delete(API_URL + `${id}`, { headers: authHeader() });
  };

  create (data)  {
    return axios.post(API_URL + 'add' , data, { headers: authHeader() });
  };

  
}

export default new UserService();

