import http from "../http-common";

const url = "/clothes";

class ClothesService {
  getClothes() {
    return http.get(url);
  }
  postCloth(formData) {
    return http.post(url, formData, { headers: { "Content-Type": "multipart/form-data" } });
  }
  putCloth(id, formData) {
    return http.put(`${url}/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
  }
  deleteClothById(id) {
    return http.delete(`${url}/${id}`);
  }
}

export default new ClothesService();
