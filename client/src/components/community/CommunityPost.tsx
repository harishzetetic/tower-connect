import { ICommunityPost, IOwnerData } from "@/Types"
import { BACKEND_URL } from "@/constants"
import { FlexBox } from "@/styled"
import { Box, Avatar, Typography, TextField, Button, Badge } from "@mui/material"
import { red } from "@mui/material/colors"
import { useSelector } from "react-redux"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite'; //fill
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'; //fill
import CommentIcon from '@mui/icons-material/Comment';
import { useState } from "react"
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { useMutation } from "@tanstack/react-query"
import { dislikeToggle, likeToggle } from "@/api/communityApis"
import { createParamsForInfoToast } from "@/util"
import { AxiosResponse } from "axios"
import Swal from "sweetalert2"
dayjs.extend(relativeTime)

//dayjs(created_at).fromNow()
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
    const [showCommentSection, setShowCommentSection] = useState<boolean>(false)

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
    

    return <>
    <FlexBox>
    <Box>
    <Avatar sx={{ bgcolor: red[500], m: 2 }} aria-label="recipe" src={`${BACKEND_URL}${post.user.imageUrl?.slice(1)}`}>
                {post.user?.firstName?.charAt(0)} {post.user?.lastName?.charAt(0)}
            </Avatar>
    </Box>
    <Box>
        <FlexBox>
        <Typography sx={{fontWeight: 'bold'}}>{post.user.firstName} {post.user.lastName} <Typography sx={{display: 'inline', fontStyle: 'italic', fontWeight: 100}}>from</Typography> {post.user.towerNumber} {post.user.flatNumber}</Typography> &nbsp; &nbsp;
        <Typography sx={{fontStyle: 'italic', fontWeight: 100}}>{dayjs(post.created_at).fromNow()}</Typography>
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
             <Button onClick={toggleComment}><CommentIcon /></Button>
            </Box>

            {showCommentSection && <CommentSection />}
           
    </Box>
</FlexBox>
<br/>
    </>
}

export default CommunityPost


const CommentSection = () => {
    const loggedInUser: IOwnerData= useSelector(reduxStore => (reduxStore as any)?.loggedInUser);    
    return<>
    <Box id="comment-box">
                <FlexBox>
                    <Box>
                    <Avatar sx={{ fontSize: 16, bgcolor: red[500], mr: 1, width: 32, height: 32}} aria-label="recipe" src={`${BACKEND_URL}${loggedInUser.imageUrl?.slice(1)}`}>
                {loggedInUser?.firstName?.charAt(0)} {loggedInUser?.lastName?.charAt(0)}
            </Avatar>
                    </Box>
                    <Box>
                        <Typography sx={{color:'white', fontSize: 12}}>Jai Shree Ram!</Typography>
                    </Box>
                </FlexBox>
                <FlexBox>
                <TextField autoFocus sx={{mt: 1}} fullWidth size='small' placeholder="Post your comment..."></TextField>
                <Button>Post</Button>
                </FlexBox>
                
            </Box>
    </>
}