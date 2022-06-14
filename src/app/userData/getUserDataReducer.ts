import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import {isBoolean} from "util";

export interface  userDataState {
    profilePhoto?: File | undefined,
    photoSrc?: string,
    userName?: string,
    email?: string,
    aboutUser?: string,
    website?: string,
    facebook?: string,
    twitter?: string,
    telegram?: string,
    ethAddress?: string,
    login?: boolean,
    error?: boolean,
    // state?: "loading" | "playing" | "paused" | "ended" | null;
}

const initialState: userDataState = {};

export const userDataSlice = createSlice({
    name: "userData",
    initialState,
    reducers: {

        userDataFetched: (
            state,
            action: PayloadAction<userDataState>
        ) => {
            return {
                ...state,
                ...action.payload,
            };
        },
        changeLoginState: (state, action: PayloadAction<boolean>) => {
            return {
                ...state,
                login: action.payload,
            };
        },
        logutUser: (state,
                    action: PayloadAction<userDataState>) => {
            return {
                ...state,
                ...action.payload,
            };
        },

    },
});

// Action creators are generated for each case reducer function
export const {
    userDataFetched,
    changeLoginState,
    logutUser
} = userDataSlice.actions;

export const selectCurrentUserData = (state: RootState) =>
    state.userData;

export default userDataSlice.reducer;
