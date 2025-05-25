import axios from "axios";
import { PATH } from "../PATH";

const services = {
  registerUser: async (body: { name: string; email: string; password: string }) => {
    try {
        const response = await axios.post(`${PATH.base}/users`, {
          name: body.name,
          email: body.email,
          password: body.password,
        });
    
        return response.data;
      } catch (err: any) {
        if (err.response) {
          if (err.response.data && Array.isArray(err.response.data)) {
            const errorMessage = err.response.data[0];
            if (errorMessage === "This email is already in use.") {
              throw new Error("Este e-mail já está em uso.");
            } else {
              throw new Error(errorMessage);
            }
          } else {
            throw new Error("Erro inesperado. Tente novamente.");
          }
        } else {
          throw new Error("Um erro ocorreu. Tente novamente mais tarde.");
        }
    }
  },
};

export default services;

