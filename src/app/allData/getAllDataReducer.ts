import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import {isBoolean} from "util";

export interface  allDataState {
    nfts?: ({ metadataObj: any; token_id: string; token_address: string; owner_of: string; } | undefined)[] | undefined
    collections?: any | undefined
    // state?: "loading" | "playing" | "paused" | "ended" | null;
}

const initialState: allDataState = {};

export const allDataSlice = createSlice({
    name: "allData",
    initialState,
    reducers: {

        nftDataFetched: (
            state,
            action: PayloadAction<allDataState>
        ) => {
            return {
                ...state,
                ...action.payload,
            };
        },
        allCollectionFetched: (
            state,
            action: PayloadAction<allDataState>
        ) => {
            return {
                ...state,
                ...action.payload,
            };
        },

    },
});

// Action creators are generated for each case reducer function
export const {
    nftDataFetched,

} = allDataSlice.actions;

export const selectCurrentAllData = (state: RootState) =>
    state.allData;

export default allDataSlice.reducer;
