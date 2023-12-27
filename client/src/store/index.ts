import {configureStore} from "@reduxjs/toolkit";
import societies from "./slices/societySlice";
import loggedInUser from "./slices/loggedInUserSlice";

const store = configureStore({
    reducer: {
        societies: societies.reducer,
        loggedInUser: loggedInUser.reducer
    }
})

export default store;