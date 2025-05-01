import http from "../http-common";

const url = "http://localhost:3000/clothes";

class clothesServices {
  getClothes() {
    return Promise.resolve(http.get(url));
  }
}

export default new clothesServices();