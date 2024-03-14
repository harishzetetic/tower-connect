import { ICommunityPost, IOwnerData, IPostComment } from "@/Types";
import { commentOnPost, deleteComment, fetchPostComments } from "@/api/communityApis";
import { QUERY_KEYS, BACKEND_URL } from "@/constants";
import { FlexBox } from "@/styled";
import { createParamsForInfoToast } from "@/util";
import { Box, Avatar, Typography, IconButton, Menu, MenuItem, TextField, Button } from "@mui/material";
import { red } from "@mui/material/colors";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import MoreVertIcon from '@mui/icons-material/MoreVert';


interface ICommentSection {
    postId:string
    setPost:Dispatch<SetStateAction<ICommunityPost>>
}

const CommentSection = (props:ICommentSection) => {
    const {postId} = props;
    const loggedInUser: IOwnerData= useSelector(reduxStore => (reduxStore as any)?.loggedInUser); 
    const [value, setValue] = useState<string>('')   
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { data: postComments, refetch:refetchComments, isLoading, isError } = useQuery({
        queryFn: async () => {
            try{
                const apiResponse = await fetchPostComments(postId)
                if (apiResponse?.status === 200) {
                    return apiResponse?.data;
                }
            }catch(e){
                Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while getting post comments'))
                return []
            }
            
        },
        queryKey: [postId], // we are passing the query key as a dynamic value, otherwise all component will show the same data
        enabled: true,
    })

    const postCommentMutate = useMutation({
        mutationFn: async() => {
            if(!postId) return;
            return await commentOnPost(postId, value);
        },
        onError: () => Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while post your comment')),
        onSuccess: (data: AxiosResponse<any, any> | undefined) => {
            data?.data && props.setPost(data.data)            
        },
        onSettled: () => { }
    })

    const deletePostMutation = useMutation({
        mutationFn: async(commentId: string) => {
            if(!postId) return;
            return await deleteComment(postId, commentId);
        },
        onError: () => Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while delete this comment')),
        onSuccess: (data: AxiosResponse<any, any> | undefined) => {
            data?.data && props.setPost(data.data)   
            // refetchComments
        },
        onSettled: () => { }
    })

    return<>
    <Box id="comment-box">
            {isLoading && <Typography>Getting comments....</Typography>}
            {isError && <Typography>Got the error while fetching comments. Please try again later</Typography>}
            {postComments && postComments.map((comment, index) => {
                return <FlexBox key={index}>
                <Box>
                <Avatar sx={{ fontSize: 16, bgcolor: red[500], mr: 1, width: 32, height: 32}} aria-label="recipe" src={`${BACKEND_URL}${comment.user.imageUrl?.slice(1)}`}>
                    {comment.user.firstName?.charAt(0)} {comment.user.lastName?.charAt(0)}
                </Avatar>
                </Box>
                <Box sx={{width: '100%'}}>
                    <Typography sx={{color:'white', fontSize: 12}}>{comment.content}</Typography>
                </Box>
                {(loggedInUser._id === comment.user._id) && <>
                    <IconButton
                    id="options-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}   
      > <MoreVertIcon /></IconButton>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'options-button',
            }}
      >
        <MenuItem onClick={()=>{
            handleClose()
            Swal.fire({
                title: `Hi ${loggedInUser.firstName}, Are you sure to delete this comment?`,
                showCancelButton: true,
                confirmButtonText: "Yes",
                icon: 'question'
              }).then((result) => {
                if (result.isConfirmed) {
                    deletePostMutation.mutate(comment._id)  
                }
              });
            }}>Delete</MenuItem>
        <MenuItem onClick={()=>{}}>Edit</MenuItem>
      </Menu>
                </>}
            </FlexBox>
            })}
                

            <FlexBox>
            <TextField value={value} onChange={e=>setValue(e.target.value)} autoFocus sx={{mt: 1}} fullWidth size='small' placeholder="Post your comment..."></TextField>
            <Button onClick={()=>postCommentMutate.mutate()} disabled={!value.length}>Post</Button>
            </FlexBox>
                
            </Box>
    </>
}

export default CommentSection