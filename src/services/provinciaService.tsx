import axios from "axios";
import { Provincia } from "../types/provincia";
const API_URL = process.env.REACT_APP_API_SA;

const getAllProvincia = async (): Promise<Provincia[]> => {
  const response = await axios.get(`${API_URL}/Provincia/GetAll`);
  return response.data;
};
const getProvinciaByPais = async (pais: string): Promise<Provincia[]> => {
  const response = await axios.get(`${API_URL}/Provincia/GetByPais?paisIso2=${pais}`);
  return response.data;
};
export { getAllProvincia, getProvinciaByPais };