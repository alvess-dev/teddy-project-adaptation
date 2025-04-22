import http from "../http-common";

const url = "https://fakestoreapi.com/products/category/women%27s%20clothing";

class clothesServices {
  getClothes() {
    return Promise.resolve(http.get(url));
  }
}

export default new clothesServices();