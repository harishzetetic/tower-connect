import { Drawer, Container, Typography, TextField, InputAdornment, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material"
import React, { use } from "react"
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { accessChatWith, searchOwners } from "@/api/ownerApis";
import { useRouter } from 'next/navigation';
import { IOwnerData } from "@/Types";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import Swal from "sweetalert2";

interface ISeachOwnerDrawer {
    toggleSeachOwner: boolean;
    setToggleSearchOwner: (value:boolean)=>void
}
const SeachOwnerDrawer = (props: ISeachOwnerDrawer) => {
    const {toggleSeachOwner, setToggleSearchOwner} = props;
    const [currentClickedOwner, setCurrentClickedOwner] = React.useState<string>('');
    const [searchOwnerPhrase, setSearchOwnerPhrase] = React.useState<string>('');
    const router = useRouter()


    const {data:userList, isLoading, refetch:refetchUserList } = useQuery({
        queryFn: () => searchOwnerList(searchOwnerPhrase),
        queryKey: [QUERY_KEYS.SEARCH_OWNER],
        enabled: false, // Now it will not immediately call the api when component mount
    })

    const {refetch:accessChat  } = useQuery({
        queryFn: () => startAChatWith(),
        queryKey: [QUERY_KEYS.CREATE_ACCESS_CHAT],
        enabled: false, // Now it will not immediately call the api when component mount
    })

    const startAChatWith = async () => {
        try{
            const apiResponse = await accessChatWith(currentClickedOwner)
            if (apiResponse?.status === 200) {
                return apiResponse?.data
            }
        }catch(e){
            console.log('There is some problem while searching owners', e)
        }
    }

    const searchOwnerList = async (searchOwnerPhrase:string) => {
        try{
            const apiResponse = await searchOwners(searchOwnerPhrase)
            if (apiResponse?.status === 200) {
                return apiResponse?.data
            }
        }catch(e){
            console.log('There is some problem while searching owners', e)
        }
    }

    React.useEffect(() => {
        refetchUserList()
    }, [searchOwnerPhrase]);

    return  <Drawer
    anchor={'right'}
    open={toggleSeachOwner}
    onClose={() => { setToggleSearchOwner(false) }}
>
    <Container sx={{ mt: 2 }}>
        <Typography variant='h5'>Seach Owner</Typography>
        <TextField InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <PersonSearchIcon />
                </InputAdornment>
            ),
        }} label="" variant="standard" 
        onChange={(e)=>{setSearchOwnerPhrase(e.target.value)}}
        value={searchOwnerPhrase}
        />
        

        <List sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
        }}>
            {userList && searchOwnerPhrase && (userList.length ? userList.map(user => <ListItem key={user._id} sx={{ bgcolor: '#1a75cd', color: 'white', borderRadius: '8px', mt: 0.5 }} onClick={()=>{
                setToggleSearchOwner(false)
                setCurrentClickedOwner(user._id)
                Swal.fire({
                    title: 'Start a chat',
                    text: `Do you want to chat with ${user.firstName} ${user.lastName}?`,
                    icon: 'question',
                    confirmButtonText: 'Okay',
                    showCancelButton: true
                  }).then((result)=>{
                    if(result.isConfirmed){
                        // call access chat api here....
                        accessChat()
                    }
                  })
            }}>
                <ListItemAvatar>
                    <Avatar>
                        <PersonSearchIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${user.firstName} ${user.lastName}`} secondary={<Typography sx={{ color: 'white' }}>{user.towerNumber}-{user.flatNumber}</Typography>} />
            </ListItem>) : <Typography>No User Found</Typography>)}
            {isLoading && <Typography>Searching...</Typography>}
        </List>
    </Container>

</Drawer>
}

export default SeachOwnerDrawer