"use client"
import PublicFooter from "@/components/landingpage/PublicFooter"
import PublicHeader from "@/components/landingpage/PublicHeader"
import { App } from "@/constants"
import { Box, Button, Container, Grid, Link, TextField, Typography } from "@mui/material";
import owner from '../../../images/owner.png';
import Image from "next/image";
import Autocomplete from '@mui/joy/Autocomplete';
import AutocompleteOption from '@mui/joy/AutocompleteOption';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import TypographyMuiJoy from '@mui/joy/Typography';
import { useEffect, useState } from "react";
import { ISociety } from "@/Types";
import { getAllSocieties } from "@/api/societiesApis";
import AllSocietyAutoCompletor from "@/components/common/AllSocietyAutoCompletor";


const OwnerLogin = () => {

    return <>
        <Box className='full_viewport_height' style={{ background: App.Background }}>
          <PublicHeader />
          <Box
          sx={{bgcolor: 'background.paper',pt: 8,pb: 6}}
        >
          <Container maxWidth="xs">   
            <Box component="form" onSubmit={()=>{}} noValidate sx={{ mt: 1 }}>
                <Box className='center_items'>
                    <Image src={owner} alt={"owner-logo"} height={100} width={100}/>
                </Box>
            <Box className='center_items' sx={{mt:2}}>
            <Typography align="center" variant="h6" noWrap component="a" href="/" sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none', }}>
                OWNER LOGIN
              </Typography>
            </Box>
            <AllSocietyAutoCompletor />
            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
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
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
            
          </Container>


        </Box>
          <PublicFooter/>
          
        </Box>
    
    </>
}

export default OwnerLogin