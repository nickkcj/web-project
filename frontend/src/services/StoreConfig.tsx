import { combineReducers, configureStore } from "@reduxjs/toolkit";
import registerSlice from "./Slices/registerSlice";
import loginSlice from "./Slices/loginSlice";

const reducer = combineReducers({
    register: registerSlice,
    login: loginSlice,
});

export const store = configureStore({ reducer });
