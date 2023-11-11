import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import style from "styled-jsx/style"

export interface ITCConfirmProps {
  open: boolean;
  handleClose: ()=>void;
  handleConfirm: () => void;
  title: string;
  description: string;
  successBtnTitle?:string;
  fullScreen?:boolean;
  hideCancel?:boolean;
}

const TCConfirm = (props: ITCConfirmProps) => {
  return (
    <Dialog
    fullScreen={props.fullScreen}
    open={props.open}
    onClose={props.handleClose}
    aria-labelledby="confirm-dialog-title"
>
  <DialogTitle id="confirm-dialog-title">
    {props.title}
  </DialogTitle>
  <DialogContent>
    <DialogContentText>
      {props.description}
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    {!props.hideCancel && <Button autoFocus onClick={props.handleClose}>
      Cancel
    </Button>}
    <Button variant="contained" onClick={props.handleConfirm}>{props.successBtnTitle || 'Go Ahead'}</Button>
  </DialogActions>
</Dialog>
  )

}

export default TCConfirm