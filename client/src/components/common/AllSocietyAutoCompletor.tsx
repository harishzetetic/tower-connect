import { IOwnerData, ISociety } from "@/Types";
import Autocomplete from '@mui/material/Autocomplete';
import {useSelector} from "react-redux"
import { TextField } from "@mui/material";
import { FormikErrors } from "formik";


interface ISocietyAutoCompletorProps  {
    name:string;
    value:ISociety | null;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<IOwnerData>>
}
const AllSocietyAutoCompletor = (props:ISocietyAutoCompletorProps) => {
    const allSocieties  = useSelector(reduxStore => (reduxStore as any)?.societies);
    return <>
    <Autocomplete
        id={props.name}
        options={allSocieties}
        value={props.value}
        getOptionLabel={(option) => `${option.builderName} ${option.societyName}`}
        renderInput={(params) => <TextField {...params} label="Choose your society" onChange={(e)=>{
            const target:ISociety = allSocieties.find((i:ISociety) => i._id === e.target.value);
            props.setFieldValue("society", target)
        }} onBlur={(e)=> {e.preventDefault();}} value={props.value} name={props.name}/>}
    />
    </>
}

export default AllSocietyAutoCompletor