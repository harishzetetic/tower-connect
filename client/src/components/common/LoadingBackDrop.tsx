import { Backdrop, CircularProgress } from "@mui/material"

export const LoadingBackDrop = (props: {isLoading: boolean}) => {
    return <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={props.isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
}

export default LoadingBackDrop