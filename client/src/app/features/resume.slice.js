import { createSlice } from "@reduxjs/toolkit";

const resumeSlice = createSlice({
  name: "resume",
  initialState: {
    resumeList: [],
    loading: false,
    error: null,
  },
  reducers: {
    setResumes: (state, action) => {
      state.resumeList = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setResumes, setLoading, setError } = resumeSlice.actions;
export default resumeSlice.reducer;
