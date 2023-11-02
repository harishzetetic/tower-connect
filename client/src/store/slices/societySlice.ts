import { ISociety } from "@/Types"
import {createSlice} from "@reduxjs/toolkit"


const societies = createSlice({
    name: "societies",
    initialState: [] as ISociety[],
    reducers: {
        addSocieties: (state, action) => {
            state = action.payload
            return state;
        }
    }
})
export const {addSocieties} = societies.actions
export default societies