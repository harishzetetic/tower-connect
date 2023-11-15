"use client"
import { useSelector } from "react-redux";

const Dashboard = () => {
    const loggedInUser = useSelector(reduxStore => (reduxStore as any).loggedInUser);
    console.log(loggedInUser)
    return <>I am dashboard</>
}

export default Dashboard