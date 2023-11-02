"use client"
import { App } from "@/constants";
import { Backdrop, Typography } from "@mui/material"
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';

const Loading = () => {
    return<>
    <Backdrop
        sx={{ background: App.Background, color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
        
      >
      <CircularProgress
        variant="indeterminate"
        sx={{
            color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
            animationDuration: '1s',
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round',
            },
          }}
        size={40}
        thickness={4}
        value={100}
      />
        <Typography component="h4" variant="h5" align="center">&nbsp; Loading... Please stay with Tower Connect.</Typography>
        <br/>
      </Backdrop>
    </>
}
export default Loading