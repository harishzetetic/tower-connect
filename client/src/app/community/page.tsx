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
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                background: 'radial-gradient(circle at 74.2% 50.9%, rgb(14, 72, 222) 5.2%, rgb(3, 22, 65) 75.3%)',
                minHeight: '100vh',
                py: 4,
            }}>
                <Box sx={{
                    width: '100%',
                    background: 'rgba(30, 34, 44, 0.98)',
                    borderRadius: 4,
                    boxShadow: '0 4px 24px 0 rgba(20, 26, 31, 0.18)',
                    p: { xs: 1, md: 3 },
                    minHeight: '80vh',
                }}>
                    {/* Post Composer */}
                    <Box sx={{
                        background: 'rgba(44, 52, 70, 0.95)',
                        borderRadius: 3,
                        boxShadow: '0 2px 12px 0 rgba(20, 26, 31, 0.10)',
                        p: 2,
                        mb: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Avatar sx={{ bgcolor: red[500], width: 48, height: 48 }} aria-label="recipe" src={`${BACKEND_URL}${loggedInUser.imageUrl?.slice(1)}`}>{loggedInUser?.firstName?.charAt(0)}{loggedInUser?.lastName?.charAt(0)}</Avatar>
                            <TextField
                                placeholder={`What's happening?`}
                                hiddenLabel
                                multiline
                                value={value}
                                onChange={e=>setValue(e.target.value)}
                                rows={3}
                                variant="outlined"
                                fullWidth
                                sx={{
                                    background: 'rgba(30, 34, 44, 0.98)',
                                    borderRadius: 2,
                                    '& .MuiOutlinedInput-root': {
                                        color: '#fff',
                                    },
                                }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <Typography sx={{ color: isCharatersExceedFromLimit() ? 'red' : '#b0b8c9', fontSize: 14 }}>{ALLOWED_CHARATERS_COMMUNITY - value.length} characters left</Typography>
                            <Button disabled={isCharatersExceedFromLimit() || !value.trim()} variant="contained" onClick={()=>{dispatchPostMutation.mutate()}}
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    fontSize: 16,
                                    px: 4,
                                    py: 1,
                                    background: 'linear-gradient(90deg, #4CAF50 0%, #2196F3 100%)',
                                    boxShadow: '0 2px 8px 0 rgba(33, 150, 243, 0.10)',
                                    '&:hover': {
                                        background: 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)',
                                    },
                                }}
                            >Post</Button>
                        </Box>
                    </Box>
                    {/* Feed */}
                    <Box>
                        {posts && (posts as ICommunityPost[]).map(item => <CommunityPost key={item._id} post={item}/>) }
                        {hasNextPage && (
                            <Button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                sx={{
                                    mt: 2,
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    fontSize: 16,
                                    background: 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)',
                                    color: '#fff',
                                    '&:hover': {
                                        background: 'linear-gradient(90deg, #4CAF50 0%, #2196F3 100%)',
                                    },
                                }}
                            >
                                {isFetchingNextPage ? 'Loading more...' : 'Load more Messages'}
                            </Button>
                        )}
                        {isLoading && !isFetchingNextPage && <Typography sx={{ color: '#b0b8c9', textAlign: 'center', mt: 2 }}>Loading...</Typography>}
                        {status === 'error' && <Typography sx={{ color: 'red', textAlign: 'center', mt: 2 }}>Error fetching data</Typography>}
                    </Box>
                </Box>
            </Box>
        </>   
        )
  

})

export default Community