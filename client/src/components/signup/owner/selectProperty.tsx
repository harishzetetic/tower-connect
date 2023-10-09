import { IOwnerSignupInitialValues, ISociety } from "@/Types";
import { getAllSocieties } from "@/api/societiesApis";
import AllSocietyAutoCompletor from "@/components/common/AllSocietyAutoCompletor";
import { Alert, Autocomplete, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { AutocompleteOption, ListItemDecorator, ListItemContent } from "@mui/joy";
import TypographyMuiJoy from '@mui/joy/Typography';


interface ISelectPropertyProps {
    values: IOwnerSignupInitialValues;
    handleChange:(e: React.ChangeEvent<any>)=> void;
    handleBlur:(e: React.ChangeEvent<any>)=> void;
    errors:any
}
const SelectProperty = (props:ISelectPropertyProps) => {
    const {values, handleChange, handleBlur, errors} = props;
    const [allSocieties, setAllSocieties] = useState<ISociety[]>([]);
    useEffect(()=>{
      const getAllSocietiesInfo = async() => {
        const result = await getAllSocieties();
        if(result){
          setAllSocieties(result.data as ISociety[]);
        }
      }
      getAllSocietiesInfo()
    }, []);
    
    return <>
    <Alert severity="info">Kindly provide the correct information. Incorrect information submission will not be approve.</Alert>
    <br/>
    <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={allSocieties}
        value={values.allSocieties}
        getOptionLabel={(option) => `${option.builderName} ${option.societyName}, ${option.city}`}
        renderInput={(params) => <TextField {...params} label="Society" value={values.allSocieties} onChange={handleChange}  onBlur={handleBlur} name="allSocieties"/>}
/>
    <TextField value={values.towerNumber} onChange={handleChange}  onBlur={handleBlur} name="towerNumber" margin="normal" fullWidth label="Tower Number" autoComplete="towerNumber" autoFocus />
    <TextField value={values.flatNumber} onChange={handleChange}  onBlur={handleBlur} name= "flatNumber" margin="normal" fullWidth label="Flat Number" autoComplete="flatNumber" autoFocus />

    </>
}
export default SelectProperty