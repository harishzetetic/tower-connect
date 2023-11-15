import { useSelector } from "react-redux";

const Dashboard = () => {
    const allSocieties = useSelector(reduxStore => (reduxStore as any));
    console.log(allSocieties)
    return <>I am dashboard</>
}

export default Dashboard