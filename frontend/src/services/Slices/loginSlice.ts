import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import services from "../services";

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginState {
  loading: boolean;
  error: boolean;
  message: string | null;
  token: string | null;
  user: User | null;
}

interface LoginBody {
  email: string;
  password: string;
}

const initialState: LoginState = {
  loading: false,
  error: false,
  message: null,
  token: null,
  user: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading   = true;
      state.error     = false;
      state.message   = null;
      state.token     = null;
      state.user      = null;
    },
    loginSuccess(state, action: PayloadAction<{ token: string; user: User }>) {
      state.loading = false;
      state.error   = false;
      state.message = "Login realizado com sucesso!";
      state.token   = action.payload.token;
      state.user    = action.payload.user;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error   = true;
      state.token   = null;
      state.user    = null;
      state.message = action.payload;
    },
    logout(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  loginSlice.actions;
export default loginSlice.reducer;

export const fetchLogin =
  (body: LoginBody) =>
  async (dispatch: any) => {
    dispatch(loginStart());
    try {
      /* API should return { token, user } example: { token: "...", user: { id, name, email } }*/
      const data = await services.loginUser(body);
      dispatch(loginSuccess(data));
    } catch (err: any) {
      console.error("Erro ao fazer login:", err.message);
      dispatch(loginFailure(err.message || "Erro ao fazer login"));
    }
  };
