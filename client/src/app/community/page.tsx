"use client"
import * as React from 'react';
import { red } from "@mui/material/colors"
import { Avatar, Box, Button, Container, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { IBuySell, ICommunityPost, IOwnerData } from "@/Types";
import { useRouter } from 'next/navigation';
import {  ALLOWED_CHARATERS_COMMUNITY, BACKEND_URL, QUERY_KEYS } from '@/constants';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from 'react-redux';
import { HOC } from '@/components/hoc/hoc';
import { createParamsForInfoToast } from '@/util';
import Swal from 'sweetalert2';
import CommunityPost from '@/components/community/CommunityPost';
import { dispatchPost, fetchCommunityPosts } from '@/api/communityApis';
import { QueryFunctionContext, UndefinedInitialDataInfiniteOptions, useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import LoadingBackDrop from '@/components/common/LoadingBackDrop';
import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

dayjs.extend(relativeTime)

interface IFetchPostResult{
        result: ICommunityPost[],
        totalPages: number,
        currentPage: number
}
const Community = HOC(({ params }) => {
    const [value, setValue] = useState<string>('');
    const loggedInUser: IOwnerData= useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
    
    const dispatchPostMutation = useMutation({
        mutationFn: async() => {
            if(loggedInUser._id){
                return await dispatchPost(value);
            }
            throw new Error('Loggedin user not found')
        },
        onError: () => Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while posting. Try Again.')),
        onSuccess: () => {
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

    const fetchPosts = async ({ pageParam = 1 }) => {
        const res = await fetchCommunityPosts(pageParam);
        return (res.data);
      };
      
      const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching: isLoading,
        isFetchingNextPage,
        status,
        refetch: refetchPosts
      } = useInfiniteQuery({
        queryKey: [QUERY_KEYS.FETCH_COMMUNITY_POSTS],
        queryFn: fetchPosts,
        getNextPageParam: (lastPage, allPages) => lastPage.currentPage + 1 <= lastPage.totalPages ? lastPage.currentPage + 1 : null
      } as any);

      const posts = data?.pages.flatMap(page => (page as IFetchPostResult).result) || [];

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
                                {hasNextPage && (
                            <Button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            >
                            {isFetchingNextPage ? 'Loading more...' : 'Load more Messages'}
                            </Button>
                        )}
                        {isLoading && !isFetchingNextPage && <p>Loading...</p>}
                        {status === 'error' && <p>Error fetching data</p>}
                            </Container>
                        </Grid>
                        <Grid item xs={12} sm={12} md={2}></Grid>
                       
                    </Grid>
          
        </>   
        )
  

})

export default Community