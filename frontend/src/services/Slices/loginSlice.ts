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

// Carregar estado inicial do localStorage
const loadInitialState = (): LoginState => {
  try {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('authUser');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return {
        loading: false,
        error: false,
        message: null,
        token,
        user,
      };
    }
  } catch (error) {
    console.error('Error loading auth state from localStorage:', error);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }
  
  return {
    loading: false,
    error: false,
    message: null,
    token: null,
    user: null,
  };
};

const initialState: LoginState = loadInitialState();

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = false;
      state.message = null;
    },
    loginSuccess(state, action: PayloadAction<{ token: string; user: User }>) {
      state.loading = false;
      state.error = false;
      state.message = "Login realizado com sucesso!";
      state.token = action.payload.token;
      state.user = action.payload.user;
      
      // Salvar no localStorage
      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('authUser', JSON.stringify(action.payload.user));
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = true;
      state.token = null;
      state.user = null;
      state.message = action.payload;
      
      // Limpar localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },
    logout(state) {
      state.loading = false;
      state.error = false;
      state.message = null;
      state.token = null;
      state.user = null;
      
      // Limpar localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      // Atualizar localStorage
      localStorage.setItem('authUser', JSON.stringify(action.payload));
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } =
  loginSlice.actions;
export default loginSlice.reducer;

export const fetchLogin =
  (body: LoginBody) =>
  async (dispatch: any) => {
    dispatch(loginStart());
    try {
      const data = await services.loginUser(body);
      dispatch(loginSuccess(data));
    } catch (err: any) {
      console.error("Erro ao fazer login:", err.message);
      dispatch(loginFailure(err.message || "Erro ao fazer login"));
    }
  };