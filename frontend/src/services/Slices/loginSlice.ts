import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import services from "../services";

interface LoginState {
  loading: boolean;
  error: boolean;
  message: string | null;
  token: string | null;
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
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = false;
      state.message = null;
      state.token = null;
    },
    loginSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = false;
      state.token = action.payload;
      state.message = "Login realizado com sucesso!";
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = true;
      state.token = null;
      state.message = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure } = loginSlice.actions;
export default loginSlice.reducer;

export const fetchLogin =
  (body: LoginBody) =>
  async (dispatch: any) => {
    dispatch(loginStart());
    try {
      const data = await services.loginUser(body);
      dispatch(loginSuccess(data.token));
    } catch (err: any) {
      console.error("Erro ao fazer login:", err.message);
      dispatch(loginFailure(err.message || "Erro ao fazer login"));
    }
  };
