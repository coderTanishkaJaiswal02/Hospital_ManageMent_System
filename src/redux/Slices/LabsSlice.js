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
export const fetchEmployees = createAsyncThunk(
  "Labs/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const res = await empApi.get("/lab-employees");
      console.log("Fetched Employees:", res.data.data);
      return res.data.data; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Insert Employee
export const insertEmployee = createAsyncThunk(
  "Labs/insertEmployee",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await empApi.post("/lab-employees", payload);
    
      
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Update Employee
export const updateEmployee = createAsyncThunk(
  "Labs/updateEmployee",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await empApi.put(`/lab-employees/${id}`, payload);
      return { id, updated: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Delete Employee
export const deleteEmployee = createAsyncThunk(
  "Labs/deleteEmployee",
  async (id, { rejectWithValue }) => {
    try {
      await empApi.delete(`/lab-employees/${id}`);
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

// 📌 Fetch Qualifications
export const fetchQualificationById = createAsyncThunk(
  "Labs/fetchQualificationById",
  async (_, { rejectWithValue }) => {
    try {
      const res = await empApi.get(`/qualifications`);
      console.log("Qualifications",res.data.data);
      
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📌 Fetch Labs
export const fetchLabById = createAsyncThunk(
  "Labs/fetchLabById",
  async (_, { rejectWithValue }) => {
    try {
      const res = await empApi.get(`/labs`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* -------------------- Slice -------------------- */
const LabsSlice = createSlice({
  name: "Labs",
  initialState: {
    employees: [],
    users: {}, 
    labs: {}, 
    qualifications: {},  // ✅ renamed for clarity
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload || [];
      })

      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch employees";
      })
      .addCase(insertEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })
     
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const { id, updated } = action.payload;
        const index = state.employees.findIndex((e) => e.id === id);
        if (index !== -1) {
          state.employees[index] = { ...state.employees[index], ...updated };
        }
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter((e) => e.id !== action.payload);
      })

      // Users
      .addCase(fetchUserById.fulfilled, (state, action) => {
        action.payload.forEach((user) => {
          state.users[user.id] = user;
        });
      })

      // Labs
      .addCase(fetchLabById.fulfilled, (state, action) => {
        action.payload.forEach((lab) => {
          state.labs[lab.id] = lab;
        });
      })

      // Qualifications ✅ fixed
      .addCase(fetchQualificationById.fulfilled, (state, action) => {
        action.payload.forEach((q) => {
          state.qualifications[q.id] = q;
        });
      });
  },
});

export default LabsSlice.reducer;




