import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Helper to get local date YYYY-MM-DD
const getLocalDate = () => {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

export const fetchTodayWater = createAsyncThunk(
    "water/fetchToday",
    async (_, { rejectWithValue }) => {
        try {
            const date = getLocalDate();
            const response = await api.get(`/water/today?date=${date}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch water log");
        }
    }
);

export const addWater = createAsyncThunk(
    "water/add",
    async (amount, { rejectWithValue }) => {
        try {
            const date = getLocalDate();
            const response = await api.post("/water/add", { amount, date });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to add water");
        }
    }
);

const initialState = {
    intakeAmount: 0,
    dailyGoal: 3000,
    loading: false,
    error: null,
};

const waterSlice = createSlice({
    name: "water",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodayWater.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTodayWater.fulfilled, (state, action) => {
                state.loading = false;
                state.intakeAmount = action.payload.intakeAmount;
                state.dailyGoal = action.payload.dailyGoal;
            })
            .addCase(fetchTodayWater.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addWater.fulfilled, (state, action) => {
                state.intakeAmount = action.payload.intakeAmount;
            });
    },
});

export default waterSlice.reducer;
