"use client"
import * as React from 'react';
import { red } from "@mui/material/colors"
import { Avatar, Box, Button, Card, CardContent, Container, Grid, ImageList, ImageListItem, InputAdornment, Paper, TextField, ThemeProvider, Typography } from "@mui/material";
import { IBuySell, ICommunityPost, IOwnerData } from "@/Types";
import {  fetchListingById } from "@/api/ownerApis";
import { useRouter } from 'next/navigation';
import {  ALLOWED_CHARATERS_COMMUNITY, BACKEND_URL, QUERY_KEYS } from '@/constants';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from 'react-redux';
import { HOC } from '@/components/hoc/hoc';
import { createParamsForInfoToast } from '@/util';
import Swal from 'sweetalert2';
import CommunityPost from '@/components/community/CommunityPost';
import { dispatchPost, fetchCommunityPosts } from '@/api/communityApis';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import LoadingBackDrop from '@/components/common/LoadingBackDrop';
dayjs.extend(relativeTime)


const Announcement = HOC(({ params }) => {
    const [listing, setListing] = React.useState<IBuySell | null>(null)
    const [value, setValue] = React.useState<string>('');

    /* ---------------------------------------------------------------------------------- */
    const router = useRouter()
    const loggedInUser: IOwnerData= useSelector(reduxStore => (reduxStore as any)?.loggedInUser);

    const dispatchPostMutation = useMutation({
        mutationFn: async() => {
            if(loggedInUser._id){
                return await dispatchPost(value);
            }
            throw new Error('Loggedin user not found')
        },
        onError: () => Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while posting. Try Again.')),
        onSuccess: (data: AxiosResponse<any, any> | undefined) => {
             Swal.fire({
                 title: 'Success',
                 text: `Post Successfully`,
                 icon: 'success',
                 confirmButtonText: 'Okay'
             })
             refetchPosts();
             setValue('');
        },
        onSettled: () => { }
    }) 


    const { data: posts, isLoading, refetch:refetchPosts } = useQuery({
        queryFn: async () => {
            try{
                const apiResponse = await fetchCommunityPosts()
                if (apiResponse?.status === 200) {
                    return apiResponse?.data;
                }
            }catch(e){
                Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while getting community posts'))
                return []
            }
            
        },
        queryKey: [QUERY_KEYS.FETCH_COMMUNITY_POSTS],
        enabled: true,
    })

    const isCharatersExceedFromLimit = () => value.length > ALLOWED_CHARATERS_COMMUNITY;
    
    React.useEffect(() => {}, []);

        return (<>
                    <LoadingBackDrop isLoading={isLoading}/>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={2}></Grid>
                        <Grid item xs={12} sm={12} md={8}>
                            <TextField 
                                placeholder={`Hi ${loggedInUser.firstName}, Type your message for your society...`}
                                hiddenLabel
                                multiline
                                value={value}
                                onChange={e=>setValue(e.target.value)}
                                rows={4}
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start" sx={{alignItems: 'self-end'}}>
                                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={`${BACKEND_URL}${loggedInUser.imageUrl?.slice(1)}`}>
                                                {loggedInUser?.firstName?.charAt(0)} {loggedInUser?.lastName?.charAt(0)}
                                        </Avatar>
                                      </InputAdornment>
                                    ),
                                  }}
                            fullWidth/>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2}}>
                                <Typography sx={{color: isCharatersExceedFromLimit() ? 'red' : ''}}>0/{ALLOWED_CHARATERS_COMMUNITY - value.length} characters</Typography>
                                <Button disabled={isCharatersExceedFromLimit()} variant="contained" onClick={()=>{dispatchPostMutation.mutate()}}>Post</Button>
                            </Box>
                            <Container>
                                {posts && (posts as ICommunityPost[]).map(item => <CommunityPost post={item}/>)}
                            </Container>
                        </Grid>
                        <Grid item xs={12} sm={12} md={2}></Grid>
                       
                    </Grid>
          
        </>   
        )
  

})

export default Announcement