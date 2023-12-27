import { IOwnerData } from "@/Types"
import {createSlice} from "@reduxjs/toolkit"


const loggedInUser = createSlice({
    name: "loggedInUser",
    initialState: {} as IOwnerData,
    reducers: {
        updatedLoggedInUser: (state, action) => {
            state = action.payload
            return state;
        }
    }
})
export const {updatedLoggedInUser} = loggedInUser.actions
export default loggedInUser

