import {createSlice} from "@reduxjs/toolkit"


const loggedInUser = createSlice({
    name: "loggedInUser",
    initialState: {},
    reducers: {
        assignLoggedInUser: (state, action) => {
            state = {
                role: action.payload.role,
                token: action.payload.data.token,
                userInfo: action.payload.data.data 
            }
            return state;
        },
        removeLoggedInUser: (state, action) => {
            state = {};
            return state;
        }
    }
})
export const {assignLoggedInUser, removeLoggedInUser} = loggedInUser.actions
export default loggedInUser