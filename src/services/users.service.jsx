import http from "../http-common";

const url = "https://jsonplaceholder.typicode.com/users";

class usersService {
  getUsers() {
    return Promise.resolve(http.get(url));
  }

  getUserById(id) {
    return Promise.resolve(http.get(`${url}/${id}`));
  }

  postUser(data) {
    return Promise.resolve(http.post(`${url}`, data));
  }

  putUser(id, data) {
    return Promise.resolve(http.put(`${url}/${id}`, data));
  }

  deleteUserById(id) {
    return Promise.resolve(http.delete(`${url}/${id}`));
  }
}

export default new usersService();