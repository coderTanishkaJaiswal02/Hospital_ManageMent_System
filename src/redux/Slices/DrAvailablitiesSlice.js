import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// 🔑 Tokens
const empToken = "539|XMoOOQ1F7Mexq8spT5TVXpnDj7U6E6XbqwU4i3WMbe7d9089";

const clinic_id = "1";
const BASE_URL = "https://hospital.51development.shop/api";

// ✅ Axios instance
const empApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${empToken}`,
    "X-Clinic-ID": clinic_id,
  },
});

/* -------------------- Thunks -------------------- */

// 📌 Fetch Employees
export const fetchDrAvailablities = createAsyncThunk(
  "Labs/fetchDrAvailablities",
  async (_, { rejectWithValue }) => {
    try {
      const res = await empApi.get("/dr-availablities");
      console.log(res.data.data);
      
      return res.data.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Insert Employee
export const insertDrAvailablities = createAsyncThunk(
  "Labs/insertDrAvailablities",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await empApi.post("/dr-availablities", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Update Employee
export const updateDrAvailablities = createAsyncThunk(
  "Labs/updateDrAvailablities",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await empApi.put(`/dr-availablities/${id}`, payload);
      console.log(res.data)
      return { id, updated: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Delete Employee
export const deleteDrAvailablities= createAsyncThunk(
  "Labs/deleteDrAvailablities",
  async (id, { rejectWithValue }) => {
    try {
      await empApi.delete(`/dr-availablities/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Fetch Users
export const fetchUserById = createAsyncThunk(
  "Labs/fetchUserById",
  async (_, { rejectWithValue }) => {
    try {
      const res = await empApi.get(`/users`);
      console.log("users",res.data);
      
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* -------------------- Slice -------------------- */
const DrAvailablitiesSlice = createSlice({
  name: "DrAvailablities",
  initialState: {
   DrAvailablities: [],  // ✅ renamed for clarity
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Employees
      .addCase(fetchDrAvailablities.fulfilled, (state, action) => {
        state.DrAvailablities = action.payload || [];
      })
      .addCase(insertDrAvailablities.fulfilled, (state, action) => {
        state.DrAvailablities.push(action.payload);
      })
     
      .addCase(updateDrAvailablities.fulfilled, (state, action) => {
        const { id, updated } = action.payload;
        const index = state.DrAvailablities.findIndex((e) => e.id === id);
        if (index !== -1) {
          state.DrAvailablities[index] = { ...state.DrAvailablities[index], ...updated };
        }
      })
      .addCase(deleteDrAvailablities.fulfilled, (state, action) => {
        state.DrAvailablities = state.DrAvailablities.filter((e) => e.id !== action.payload);
      })
      
  },
});

export default DrAvailablitiesSlice.reducer;




