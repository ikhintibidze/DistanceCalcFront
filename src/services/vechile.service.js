import axios from 'axios';


const API_URL = 'http://localhost:8080/api/vechile/';

class VechileService {
  
  getAll() {
    return axios.get(API_URL + 'all');
  }

  getById(id) {
    return axios.get(API_URL + `${id}`);
  }

  update (id, data)  {
    return axios.put(API_URL + `${id}`, data);
  };

  delete (id)  {
    return axios.delete(API_URL + `${id}`);
  };

  create (data)  {
    return axios.post(API_URL + 'add' , data);
  };
  
  calculateDistance(src,dst) {
    return axios.get(API_URL + `${src}` +`/`+`${dst}`);
  }
  
}

export default new VechileService();
