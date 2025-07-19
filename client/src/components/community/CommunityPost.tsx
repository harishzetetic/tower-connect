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
    <FlexBox>
    <Box>
    <Avatar sx={{ bgcolor: red[500], m: 2 }} aria-label="recipe" src={`${BACKEND_URL}${post.user.imageUrl?.slice(1)}`}>
                {post.user?.firstName?.charAt(0)} {post.user?.lastName?.charAt(0)}
            </Avatar>
    </Box>
    <Box sx={{width: '100%'}}>
        <FlexBox>
        <Typography sx={{fontWeight: 'bold'}}>{post.user.firstName} {post.user.lastName} <Typography sx={{display: 'inline', fontStyle: 'italic', fontWeight: 100}}>from</Typography> {post.user.towerNumber} {post.user.flatNumber}</Typography> &nbsp; &nbsp;
        <Typography sx={{flexGrow: 1, fontStyle: 'italic', fontWeight: 100}}>posted {dayjs(post.created_at).fromNow()}</Typography>
        {(post.user._id === loggedInUser._id)  && <>
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
        </FlexBox>
        
        <Typography sx={{mb: 2}}>
        {post.content}
        </Typography>
            <Box sx={{display: 'flex', color: 'white', pb: 1, flexDirection: 'row'}}>
            <Button onClick={()=>likeToggleMutation.mutate()}>
            <Badge badgeContent={post.likes.length || 0} color="error">
                {isPostLiked ? <FavoriteIcon sx={{color: 'red'}}/>: <FavoriteBorderIcon />}
            </Badge>
                
                </Button>
            <Button onClick={()=>dislikeToggleMutation.mutate()}>
            <Badge badgeContent={post.dislikes.length || 0} color="error">
            {isPostDisLiked ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
            </Badge>
                
                </Button>
             <Button onClick={toggleComment}>
             <Badge badgeContent={post.comments.length || 0} color="error">
                <CommentIcon />
             </Badge>
                </Button>
            </Box>

            {showCommentSection && <CommentSection postId={post._id}/>}
            <EditPostPopup open={openEditPostPopup} post={post} onClose={()=>{setOpenEditPostPopup(!openEditPostPopup)}} editPostMutation={editPostMutation}/>
    </Box>
</FlexBox>
<br/>
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