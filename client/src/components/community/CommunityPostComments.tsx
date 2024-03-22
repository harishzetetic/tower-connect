import { ICommunityPost, IOwnerData, IPostComment } from "@/Types";
import { commentOnPost, deleteComment, editComment, fetchPostComments } from "@/api/communityApis";
import { QUERY_KEYS, BACKEND_URL, ALLOWED_CHARATERS_COMMUNITY } from "@/constants";
import { FlexBox } from "@/styled";
import { createParamsForInfoToast } from "@/util";
import { Box, Avatar, Typography, IconButton, Menu, MenuItem, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { red } from "@mui/material/colors";
import { useQuery, useMutation, QueryObserverResult, RefetchOptions, UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import MoreVertIcon from '@mui/icons-material/MoreVert';


interface ICommentSection {
    postId: string
}

const CommentSection = (props: ICommentSection) => {
    const { postId } = props;
    const loggedInUser: IOwnerData = useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
    const [value, setValue] = useState<string>('')

    const { data: postComments, refetch: refetchComments, isLoading, isError } = useQuery({
        queryFn: async () => {
            try {
                const apiResponse = await fetchPostComments(postId)
                if (apiResponse?.status === 200) {
                    return apiResponse?.data;
                }
            } catch (e) {
                Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while getting post comments'))
                return []
            }

        },
        queryKey: [postId], // we are passing the query key as a dynamic value, otherwise all component will show the same data
        enabled: true,
    })

    const postCommentMutate = useMutation({
        mutationFn: async () => {
            if (!postId) return;
            return await commentOnPost(postId, value);
        },
        onError: () => Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while post your comment')),
        onSuccess: (data: AxiosResponse<ICommunityPost, any> | undefined) => {
            refetchComments()
            setValue('');
        },
        onSettled: () => { }
    })

   

    return <>
        <Box id="comment-box">
            {isLoading && <Typography>Getting comments....</Typography>}
            {isError && <Typography>Got the error while fetching comments. Please try again later</Typography>}
            {postComments && postComments.map((comment, index) => {
                return <FlexBox key={index}>
                    <Box>
                        <Avatar sx={{ fontSize: 16, bgcolor: red[500], mr: 1, width: 32, height: 32 }} aria-label="recipe" src={`${BACKEND_URL}${comment.user.imageUrl?.slice(1)}`}>
                            {comment.user.firstName?.charAt(0)} {comment.user.lastName?.charAt(0)}
                        </Avatar>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <Typography sx={{ color: 'white', fontSize: 12 }}>{comment.content}</Typography>
                    </Box>
                    {(loggedInUser._id === comment.user._id) && <ManageCommentOptions 
                        comment={comment} 
                        postId={postId}
                        loggedInUserFirstName={loggedInUser.firstName}
                        refetchComments={refetchComments}/>}
                </FlexBox>
            })}
            <FlexBox>
                <TextField value={value} onChange={e => setValue(e.target.value)} autoFocus sx={{ mt: 1 }} fullWidth size='small' placeholder="Post your comment..."></TextField>
                <Button onClick={() => postCommentMutate.mutate()} disabled={!value.length}>Post</Button>
            </FlexBox>
        </Box>
    </>
}

interface IManageCommentOptions {
    comment: IPostComment;
    postId: string;
    loggedInUserFirstName: string | null;
    refetchComments: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<IPostComment[] | undefined, Error>>
}
const ManageCommentOptions = (props: IManageCommentOptions) => {
    const {comment, postId, loggedInUserFirstName, refetchComments} = props;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [IsEditCommentDialogOpen, setIsEditCommentDialogOpen] = useState(false);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const deletePostCommentMutation = useMutation({
        mutationFn: async (commentId: string) => {
            if (!postId) return;
            return await deleteComment(postId, commentId);
        },
        onError: () => Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while delete this comment')),
        onSuccess: (data: AxiosResponse<any, any> | undefined) => {
            refetchComments()
        },
        onSettled: () => { }
    })

    const editPostCommentMutation = useMutation({
        mutationFn: async (data: {commentId: string, updatedContent:string}) => {
            if (!postId) return;
            return await editComment(postId, data.commentId, data.updatedContent);
        },
        onError: () => Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while delete this comment')),
        onSuccess: (data: AxiosResponse<any, any> | undefined) => {
            refetchComments()
        },
        onSettled: () => {
            setIsEditCommentDialogOpen(false)
         }
    })

    return <>
    <IconButton
        id={`options-button-for-${comment._id}`}
        aria-controls={open ? `basic-menu-for-${comment._id}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
    > <MoreVertIcon /></IconButton>
    <Menu
        id={`basic-menu-for-${comment._id}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
            'aria-labelledby': `options-button-for-${comment._id}`,
        }}
    >
        <MenuItem onClick={() => {
            handleClose()
            Swal.fire({
                title: `Hi ${loggedInUserFirstName}, Are you sure to delete this comment?`,
                showCancelButton: true,
                confirmButtonText: "Yes",
                icon: 'question'
            }).then((result) => {
                if (result.isConfirmed) {
                    deletePostCommentMutation.mutate(comment._id)
                }
            });
        }}>Delete</MenuItem>
        <MenuItem onClick={() => { 
            handleClose();
            setIsEditCommentDialogOpen(open);
        }}>Edit</MenuItem>
    </Menu>
    <EditCommentPopup editPostCommentMutation={editPostCommentMutation} open={IsEditCommentDialogOpen} comment={comment} onClose={()=>setIsEditCommentDialogOpen(false)}/>
</>
}

interface IEditCommentPopup{
    open: boolean;
    comment: IPostComment;
    onClose: ()=>void;
    editPostCommentMutation: UseMutationResult<AxiosResponse<any, any> | undefined, Error, {
        commentId: string;
        updatedContent: string;
    }, unknown>
}
const EditCommentPopup = (props:IEditCommentPopup) => {
    const {open, comment, onClose, editPostCommentMutation} = props;
    const [content, setContent] = useState(comment.content)
    const isCharatersExceedFromLimit = () => comment.content.length > ALLOWED_CHARATERS_COMMUNITY;

    return <Dialog onClose={onClose} open={open} fullWidth>
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
    <Button color="secondary" onClick={()=>setContent(comment.content)}>Reset</Button>
<Button onClick={()=>editPostCommentMutation.mutate({commentId: comment._id, updatedContent: content})} variant="contained" color="success">
  Save
</Button>
<Button variant="outlined" color="info" onClick={()=>onClose()}>
  Close
</Button>
    </DialogActions>
  </Dialog>
}


export default CommentSection