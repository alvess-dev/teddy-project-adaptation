import http from "../http-common";

const url = "/users";

class usersService {
  getUsers() {
    return http.get(url); 
  }
  
  getUserById(id) {
    return http.get(`${url}/${id}`);  
  }

  postUser(data) {
    return http.post(url, data);
  }

  putUser(id, data) {
    return http.put(`${url}/${id}`, data);
  }

  deleteUserById(id) {
    return http.delete(`${url}/${id}`);
  }
}

export default new usersService();
