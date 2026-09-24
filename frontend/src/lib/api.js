import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const fetchMarkers = async () => (await axios.get(`${API}/markers`)).data;
export const createMarker = (data) => axios.post(`${API}/markers`, data).then((r) => r.data);
export const updateMarker = (id, data) => axios.patch(`${API}/markers/${id}`, data).then((r) => r.data);
export const deleteMarker = (id) => axios.delete(`${API}/markers/${id}`).then((r) => r.data);

export const pesanError = (e) => e?.response?.data?.detail || "Terjadi kesalahan, coba lagi";
