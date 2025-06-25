import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import services from "../index";

interface RegisterState {
  loading: boolean;
  error: boolean;
  message: string | null;
}

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

const initialState: RegisterState = {
  loading: false,
  error: false,
  message: null,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    registerStart(state) {
      state.loading = true;
      state.error = false;
      state.message = null;
    },
    registerSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = false;
      state.message = action.payload;
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = true;
      state.message = action.payload;
    },
  },
});

export const { registerStart, registerSuccess, registerFailure } = registerSlice.actions;
export default registerSlice.reducer;

export const fetchRegister =
  (body: RegisterBody) =>
  async (dispatch: any) => {
    dispatch(registerStart());
    try {
      await services.registerUser(body);
      dispatch(registerSuccess("Conta criada com sucesso!"));
    } catch (err: any) {
      console.error("Erro ao registrar:", err.message);
      dispatch(registerFailure(err.message || "Erro ao registrar"));
    }
  };
