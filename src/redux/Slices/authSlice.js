import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fixed: Correct base URL with /api path
const BASE_URL = "https://hospital.51development.shop/api";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, thunkAPI) => {
    try {
      // ✅ Fixed: Correct URL and removed X-Clinic-ID header
      const res = await axios.post(`${BASE_URL}/login`, userData, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          // ❌ Removed: "X-Clinic-ID": clinic_id, // Don't send this during login!
        },
      });

      // ✅ Store token and clinic_id after successful login
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("clinic_id", res.data.clinic_id);
      console.log(res.data);

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

export const fetchLoggedInUser = createAsyncThunk(
  "auth/fetchLoggedInUser",
  async (_, thunkAPI) => {
    try {
      // ✅ Fixed: Get fresh values from localStorage
      const token = localStorage.getItem("token");
      const clinic_id = localStorage.getItem("clinic_id");

      const res = await axios.get(`${BASE_URL}/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-Clinic-ID": clinic_id,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Failed to fetch user" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    token: null,
    user: null,
  },
  reducers: {
    // ✅ Added: Logout action to clear localStorage
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("clinic_id");
    },
    // ✅ Added: Clear error action
    clearError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      .addCase(fetchLoggedInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoggedInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchLoggedInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch user";
      });
  },
});

// ✅ Export actions
export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;


// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const BASE_URL = "https://hospital.51development.shop/api";

// const token = localStorage.getItem("token");
// const clinic_id = localStorage.getItem("clinic_id");

// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async (userData, thunkAPI) => {
//     try {
//       const res = await axios.post(`${BASE_URL}/login`, userData, {
//         headers: {
//           "X-Clinic-ID": clinic_id, // 👈 send this
//         },
//       });

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("clinic_id", res.data.clinic_id);
//       console.log(res.data);

//       return res.data;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response.data);
//     }
//   }
// );

// export const fetchLoggedInUser = createAsyncThunk(
//   "auth/fetchLoggedInUser",
//   async (_, thunkAPI) => {
//     try {
//       const res = await axios.get("http://hospital.51development.shop/api/me", {
//         headers: { Authorization: `Bearer ${token}`, "X-Clinic-ID": clinic_id },
//       });

//       return res.data.user;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response.data);
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     loading: false,
//     error: null,
//     token: null,
//     user: null,
//   },
//   reducers: {},

//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.token = action.payload.token;
//         state.user = action.payload.user;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || "Login failed";
//       })
//       .addCase(fetchLoggedInUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchLoggedInUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(fetchLoggedInUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || "Failed to fetch user";
//       });
//   },
// });

// export default authSlice.reducer;
