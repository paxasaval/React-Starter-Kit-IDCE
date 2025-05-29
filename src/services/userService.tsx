import axios from "axios";
import api from "../interceptors/authInterceptor";//Usar el interceptor para endpoint protegidos
import { GetUsuariosByInstitucionDTO, TokenRequest } from "../types/user";
const API_URL = process.env.REACT_APP_API_SA;

const validateToken = async (token: TokenRequest) => {
  const response = await axios.post(`${API_URL}/Usuario/ValidarJWT`, token, {withCredentials: true});
  return response.data;
};

const getUsersByIntitucion = async (institucionID: number): Promise<GetUsuariosByInstitucionDTO[]> => {
  const response = await axios.get(`${API_URL}/Usuario/GetUsuarioByInstitucion?institucionID=${institucionID}`);
  return response.data;
};

export { validateToken, getUsersByIntitucion };