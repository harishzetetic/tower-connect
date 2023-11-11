"use client"
import { adminSignIn, fetchPendingAccounts } from "@/api/adminApis";
import PublicHeader from "@/components/landingpage/PublicHeader";
import { App } from "@/constants";
import { Box, Button, Container, Grid, Link, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { NotificationContainer, NotificationManager } from 'react-notifications';


// data need to fetch from api
// 1. pending accounts

const SuperAdminLogin = () => {
    const router = useRouter()
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const onSubmitHandler = async () => {
        try{
            const response = await adminSignIn({
                userId: email,
                password: password
            })
            if(response?.data?.token && response?.data?.message === "SUCCESS"){
                NotificationManager.success('Success', 'Login Done', 15000, () => { });
                sessionStorage.setItem('token', response?.data?.token)
                router.push('/admin/admindashboard')
            } else if(response?.data.message === "FAIL") {
                NotificationManager.error('Fail', 'Login Failed', 15000, () => { });
            }
        } catch(e){
            NotificationManager.error('Error', 'Getting error while register for new owner', 15000, () => { });
        }
        
    }
    return <>
        <Box style={{ background: App.Background }}><PublicHeader /></Box>
        <Box className='full_viewport_height' >
            <Container maxWidth="xs">
           
                <Box className='center_items' sx={{ mt: 2 }}>

                    <Typography align="center" variant="h6" noWrap sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none', }}>
                        Super Admin Login
                    </Typography>
                </Box>
                <TextField margin="normal" required value={email} onChange={e => setEmail(e.target.value)} fullWidth id="email" label="Email Address" autoComplete="email" autoFocus />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={onSubmitHandler}
                >
                    Sign In
                </Button>
            </Container>
            <NotificationContainer />
        </Box>
    </>
}

export default SuperAdminLogin