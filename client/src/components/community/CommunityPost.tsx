import { ICommunityPost, IOwnerData } from "@/Types"
import { ALLOWED_CHARATERS_COMMUNITY, BACKEND_URL, QUERY_KEYS } from "@/constants"
import { FlexBox } from "@/styled"
import { Box, Avatar, Typography, TextField, Button, Badge, Menu, MenuItem, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { red } from "@mui/material/colors"
import { useSelector } from "react-redux"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite'; //fill
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'; //fill
import CommentIcon from '@mui/icons-material/Comment';
import { Dispatch, SetStateAction, useState } from "react"
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { UseMutationResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { commentOnPost, deletePost, dislikeToggle, likeToggle, updatePost } from "@/api/communityApis"
import { createParamsForInfoToast } from "@/util"
import { AxiosResponse } from "axios"
import Swal from "sweetalert2"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CommentSection from "./CommunityPostComments"
dayjs.extend(relativeTime)

interface IPost{
    post: ICommunityPost
}
enum Reactions {
    Like,
    Dislike,
    None,
  }
const CommunityPost = (props: IPost) => {
    const loggedInUser: IOwnerData= useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
    const [post, setPost] = useState<ICommunityPost>(props.post)
    const [showCommentSection, setShowCommentSection] = useState<boolean>(false);
    const [openEditPostPopup, setOpenEditPostPopup] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const queryClient = useQueryClient()
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const getReaction = () => {
        if(loggedInUser._id){
            if(post.likes.includes(loggedInUser._id)){
                return Reactions.Like
            } else if(post.dislikes.includes(loggedInUser._id)){
                return Reactions.Dislike
            }
        }
        return Reactions.None
    }
    const isPostLiked = getReaction() === Reactions.Like;
    const isPostDisLiked = getReaction() === Reactions.Dislike;
    
    const toggleComment = () => {
        setShowCommentSection(!showCommentSection)
    }
    
    const likeToggleMutation = useMutation({
        mutationFn: async() => {
            if(!post._id) throw new Error('Post not ready probably');
            return await likeToggle(post._id, !isPostLiked);
        },
        onError: () => Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while like this post. Try Again.')),
        onSuccess: (data: AxiosResponse<any, any> | undefined) => {
            data?.data && setPost(data.data)
        },
        onSettled: () => { }
    }) 

    const dislikeToggleMutation = useMutation({
        mutationFn: async() => {
            if(!post._id) throw new Error('Post not ready probably');
            return await dislikeToggle(post._id, !isPostDisLiked);
        },
        onError: () => Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while dislike this post. Try Again.')),
        onSuccess: (data: AxiosResponse<any, any> | undefined) => {
            data?.data && setPost(data.data)            
        },
        onSettled: () => { }
    })
    
    const deletePostMutation = useMutation({
        mutationFn: async() => {
            if(!post._id) throw new Error('Post not ready probably');
            return await deletePost(post._id);
        },
        onError: () => Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while deleting this post. Try Again.')),
        onSuccess: (data: AxiosResponse<any, any> | undefined) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FETCH_COMMUNITY_POSTS] })        
        },
        onSettled: () => { }
    })

    const editPostMutation = useMutation({
        mutationFn: async(updatedContent: string) => {
            if(!post._id) throw new Error('Post not ready probably');
            return await updatePost(post._id, updatedContent);
        },
        onError: () => Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while like this post. Try Again.')),
        onSuccess: (data: AxiosResponse<any, any> | undefined) => {
            data?.data && setPost(data.data)   
            Swal.fire(createParamsForInfoToast('success', 'Success', 'Post has been updated'))
        },
        onSettled: () => { }
    }) 
    


    return <>
    <Box sx={{
        background: 'rgba(44, 52, 70, 0.95)',
        borderRadius: 3,
        boxShadow: '0 2px 12px 0 rgba(20, 26, 31, 0.10)',
        p: 2,
        mb: 3,
        transition: 'box-shadow 0.2s',
        '&:hover': {
            boxShadow: '0 4px 24px 0 rgba(33, 150, 243, 0.18)',
        },
        display: 'flex',
        gap: 2,
    }}>
        <Avatar sx={{ bgcolor: red[500], width: 48, height: 48, mt: 0.5 }} aria-label="recipe" src={`${BACKEND_URL}${post.user.imageUrl?.slice(1)}`}>{post.user?.firstName?.charAt(0)}{post.user?.lastName?.charAt(0)}</Avatar>
        <Box sx={{width: '100%'}}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{fontWeight: 'bold', color: '#fff', fontSize: 16}}>{post.user.firstName} {post.user.lastName}</Typography>
                <Typography sx={{ color: '#b0b8c9', fontSize: 14, fontWeight: 400 }}>@{post.user.towerNumber}{post.user.flatNumber}</Typography>
                <Typography sx={{flexGrow: 1, color: '#b0b8c9', fontSize: 13, ml: 2}}>{dayjs(post.created_at).fromNow()}</Typography>
                {(post.user._id === loggedInUser._id)  && <>
                    <IconButton
                        id="options-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}     
                        sx={{ color: '#b0b8c9' }}
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
                                title: `Hi ${loggedInUser.firstName}, Are you sure to delete this post?`,
                                showCancelButton: true,
                                confirmButtonText: "Yes",
                                icon: 'question'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    deletePostMutation.mutate()  
                                }
                            });
                            }}>Delete</MenuItem>
                        <MenuItem onClick={()=>{setOpenEditPostPopup(true)}}>Edit</MenuItem>
                    </Menu>
                </>}
            </Box>
            <Typography sx={{mb: 2, color: '#fff', fontSize: 17, lineHeight: 1.6}}>
                {post.content}
            </Typography>
            <Box sx={{display: 'flex', color: '#b0b8c9', pb: 1, flexDirection: 'row', gap: 1}}>
                <Button onClick={()=>likeToggleMutation.mutate()} sx={{ color: isPostLiked ? '#e0245e' : '#b0b8c9', minWidth: 0, px: 1 }}>
                    <Badge badgeContent={post.likes.length || 0} color="error">
                        {isPostLiked ? <FavoriteIcon sx={{color: '#e0245e'}}/>: <FavoriteBorderIcon />}
                    </Badge>
                </Button>
                <Button onClick={()=>dislikeToggleMutation.mutate()} sx={{ color: isPostDisLiked ? '#1da1f2' : '#b0b8c9', minWidth: 0, px: 1 }}>
                    <Badge badgeContent={post.dislikes.length || 0} color="error">
                        {isPostDisLiked ? <ThumbDownAltIcon sx={{ color: '#1da1f2' }} /> : <ThumbDownOffAltIcon />}
                    </Badge>
                </Button>
                <Button onClick={toggleComment} sx={{ color: '#b0b8c9', minWidth: 0, px: 1 }}>
                    <Badge badgeContent={post.comments.length || 0} color="error">
                        <CommentIcon />
                    </Badge>
                </Button>
            </Box>
            {showCommentSection && <CommentSection postId={post._id}/>}
            <EditPostPopup open={openEditPostPopup} post={post} onClose={()=>{setOpenEditPostPopup(!openEditPostPopup)}} editPostMutation={editPostMutation}/>
        </Box>
    </Box>
    </>
}

export default CommunityPost

interface IEditPostPopup {
    open: boolean,
    post: ICommunityPost,
    onClose: ()=> void,
    editPostMutation: UseMutationResult<AxiosResponse<any, any> | undefined, Error, string, unknown>
}
const EditPostPopup = (props:IEditPostPopup) => {
    const [content, setContent] = useState(props.post.content)
    const isCharatersExceedFromLimit = () => content.length > ALLOWED_CHARATERS_COMMUNITY;
    const onSave = () => {
        props.editPostMutation.mutate(content)
        props.onClose()
    }
    return <Dialog onClose={props.onClose} open={props.open} fullWidth>
    <DialogTitle>Edit Post</DialogTitle>
    <DialogContent>
    <TextField
          label="Post Content"
          multiline
          value={content}
          onChange={e=>setContent(e.target.value)}
          rows={4}
          fullWidth
          sx={{mt:2, mb:2}}
        />
        <Typography sx={{color: isCharatersExceedFromLimit() ? 'red' : ''}}>0/{ALLOWED_CHARATERS_COMMUNITY - content.length} characters</Typography>
    
    </DialogContent>
    <DialogActions>
    <Button color="secondary" onClick={()=>setContent(props.post.content)}>Reset</Button>
<Button onClick={onSave} variant="contained" color="success">
  Save
</Button>
<Button variant="outlined" color="info" onClick={()=>props.onClose()}>
  Close
</Button>
    </DialogActions>
  </Dialog>
}