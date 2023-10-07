import { ISociety } from "@/Types";
import { getAllSocieties } from "@/api/societiesApis";
import { AutocompleteOption, ListItemDecorator, ListItemContent } from "@mui/joy";
import Autocomplete from '@mui/joy/Autocomplete';
import { useState, useEffect } from "react";
import TypographyMuiJoy from '@mui/joy/Typography';



const AllSocietyAutoCompletor = () => {
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
              id="society-select"
              placeholder="Choose your society"
              slotProps={{
                input: {
                  autoComplete: 'new-password', // disable autocomplete and autofill
                },
              }}
              
              options={allSocieties}
              autoHighlight
              getOptionLabel={(option) => `${option.builderName} ${option.societyName}`}
              renderOption={(props, option) => (
                <AutocompleteOption {...props}>
                  <ListItemDecorator>
                    {/* <img
                      loading="lazy"
                      width="20"
                      srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                      src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                      alt=""
                    /> */}
                  </ListItemDecorator>
                  <ListItemContent sx={{ fontSize: 'sm' }}>
                  {option.builderName} {option.societyName}
                    <TypographyMuiJoy level="body-xs">
                      {option.city}
                    </TypographyMuiJoy>
                  </ListItemContent>
                </AutocompleteOption>
              )}
            />
    </>
}

export default AllSocietyAutoCompletor