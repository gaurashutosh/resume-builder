import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "../features/resume/resumeSlice";

const store = configureStore({
    reducer: {
        resume: resumeReducer,
    },
});

export default store;