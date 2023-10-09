import { ISociety } from "@/Types";
import { getAllSocieties } from "@/api/societiesApis";
import { AutocompleteOption, ListItemDecorator, ListItemContent } from "@mui/joy";
import Autocomplete from '@mui/joy/Autocomplete';
import { useState, useEffect } from "react";
import TypographyMuiJoy from '@mui/joy/Typography';


interface ISocietyAutoCompletorProps  {
    name:string;
    value:string;
    onChange:(e: React.ChangeEvent<any>)=> void;
    onBlur:(e: React.ChangeEvent<any>)=> void;
    errors:any
}
const AllSocietyAutoCompletor = (props:ISocietyAutoCompletorProps) => {
    const {name} = props;
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
    <Autocomplete
        placeholder="Choose your society"
        name={name}
        onChange={props.onChange}
        onBlur={props.onBlur}
        // value={props.value}
        options={allSocieties}
        getOptionLabel={(option) => `${option.builderName} ${option.societyName}`}
        renderOption={(props, option) => (
        <AutocompleteOption {...props}>
            <ListItemContent sx={{ fontSize: 'sm' }}>
            {option.builderName} {option.societyName}
            <TypographyMuiJoy level="body-xs">{option.city}</TypographyMuiJoy>
            </ListItemContent>
        </AutocompleteOption>
        )}
    />
    </>
}

export default AllSocietyAutoCompletor