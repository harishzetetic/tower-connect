import {configureStore} from "@reduxjs/toolkit";
import societies from "./slices/societySlice";
const store = configureStore({
    reducer: {
        societies: societies.reducer
    }
})

export default store;