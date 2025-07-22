"use client"
import PublicFooter from "@/components/landingpage/PublicFooter"
import PublicHeader from "@/components/landingpage/PublicHeader"
import { App } from "@/constants"
import * as Yup from 'yup';
import { Autocomplete, Box, Container, FormHelperText, Grid, TextField, ThemeProvider, Typography } from "@mui/material";
import owner from '../../../images/owner.png';
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { Formik } from "formik";
import { APP_THEME, IOwnerData, IOwnerLoginData, ISociety, SocietyValidationSchema } from "@/Types";
import { useSelector } from "react-redux";
import {  ownerLoginRequest } from "@/api/ownerApis";
import { useDispatch } from "react-redux";
import {default as NextLink} from "next/link";
import { TCButton } from "@/styled";
import { updatedLoggedInUser } from "@/store/slices/loggedInUserSlice";
import React from "react";
import { createParamsForInfoToast } from "@/util";
import Swal from "sweetalert2";
import LoadingBackDrop from "@/components/common/LoadingBackDrop";

export const OwnerLoginSchema = Yup.object({
  society: SocietyValidationSchema,
  towerNumber: Yup.string().matches(/^[a-zA-Z0-9]*$/, { message: 'Only alpha/numeric characters are allowed'}).required('Tower Number is required'),
  flatNumber:  Yup.string().matches(/^[0-9]*$/, { message: 'Only numeric characters are allowed'}).required('Flat Number is required'),
  password:Yup.string().required("Password id required"),
})

const loginRequest = async () => {
  // const response = await ownerLoginRequest(formData);
}

const OwnerLogin = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = React.useState<boolean>(false)
  const allSocieties: Array<ISociety> = useSelector(reduxStore => (reduxStore as any)?.societies);
  const initialValues = {
    societyId: null,
    towerNumber: null,
    flatNumber: null,
    password: null,
} as IOwnerLoginData ;

  const loginHandler = async(formData: IOwnerLoginData) => {
    setIsLoginButtonDisabled(true)
    try{
      const response = await ownerLoginRequest(formData);
      if(response?.data.token){
        localStorage.setItem('token', response.data.token);
        dispatch(updatedLoggedInUser(response.data.data as IOwnerData))
        Swal.fire(createParamsForInfoToast('success', 'Login Success', 'Redirecting to dashboard', 15000))
        router.push('/dashboard')
      } else {
        Swal.fire(createParamsForInfoToast('error', 'Error', 'Invalid credentials', 15000))
        setIsLoginButtonDisabled(false);
      }
      
    } catch(e){
      Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while signin', 15000))
      setIsLoginButtonDisabled(false);
    }
  }
  return <ThemeProvider theme={APP_THEME}>
    <LoadingBackDrop isLoading={isLoginButtonDisabled}/>
    <Box className='full_viewport_height' sx={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 74.2% 50.9%, rgb(14, 72, 222) 5.2%, rgb(3, 22, 65) 75.3%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* <PublicHeader /> */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
        <Formik initialValues={initialValues} onSubmit={(formData) => {loginHandler(formData) }} enableReinitialize={true} validationSchema={OwnerLoginSchema}>
          {({ values, setFieldValue, errors, resetForm, submitForm }) => (
            <Container maxWidth="xs" sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Box sx={{
                width: '100%',
                background: 'rgba(30, 34, 44, 0.98)',
                borderRadius: 4,
                boxShadow: '0 4px 24px 0 rgba(20, 26, 31, 0.18)',
                p: { xs: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4,
              }}>
                <Box className='center_items' sx={{ mb: 2 }}>
                  <Image src={owner} alt={"owner-logo"} height={90} width={90} style={{ filter: 'drop-shadow(0 2px 8px #2196F3)' }} />
                </Box>
                <Typography align="center" variant="h5" sx={{
                  fontWeight: 900,
                  letterSpacing: '.2rem',
                  background: 'linear-gradient(90deg, #4CAF50 0%, #2196F3 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                  textShadow: '0 2px 8px rgba(33,150,243,0.10)',
                }}>
                  OWNER LOGIN
                </Typography>
                <Autocomplete
                  disablePortal
                  id="society-select"
                  options={allSocieties.map(society => {
                    return {
                      label: `${society.builderName} ${society.societyName} | ${society.city}, ${society.country}`,
                      value: society._id
                    }
                  })}
                  onChange={(_, value) => {
                    if (value) {
                      setFieldValue("societyId", value?.value)
                    } else {
                      setFieldValue("societyId", null)
                    }
                  }}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Society Name" name={"societyId"} error={!!errors.societyId} variant="outlined" fullWidth sx={{
                    input: { color: '#fff' },
                    label: { color: '#b0b8c9' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: 'rgba(44, 52, 70, 0.85)',
                      color: '#fff',
                    },
                  }} />}
                />
                <FormHelperText sx={{ color: App.ErrorTextColor }}>{errors.societyId}</FormHelperText>
                <TextField 
                  color="primary"
                  variant="outlined" 
                  error={!!errors.towerNumber} 
                  helperText={errors.towerNumber} 
                  value={values.towerNumber} 
                  onChange={(e) => setFieldValue("towerNumber", e.target.value.toUpperCase())} 
                  name="towerNumber" 
                  margin="normal" 
                  fullWidth 
                  label="Tower Number" 
                  autoFocus
                  sx={{
                    input: { color: '#fff' },
                    label: { color: '#b0b8c9' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: 'rgba(44, 52, 70, 0.85)',
                      color: '#fff',
                    },
                  }}
                />
                <TextField type="number" error={!!errors.flatNumber} helperText={errors.flatNumber} value={values.flatNumber} onChange={(e) => setFieldValue("flatNumber", e.target.value)} name="flatNumber" margin="normal" fullWidth label="Flat Number" autoFocus sx={{
                  input: { color: '#fff' },
                  label: { color: '#b0b8c9' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    background: 'rgba(44, 52, 70, 0.85)',
                    color: '#fff',
                  },
                }} />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  error={!!errors.password} 
                  helperText={errors.password} 
                  value={values.password} 
                  onChange={(e) => setFieldValue("password", e.target.value)}
                  autoComplete="current-password"
                  sx={{
                    input: { color: '#fff' },
                    label: { color: '#b0b8c9' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: 'rgba(44, 52, 70, 0.85)',
                      color: '#fff',
                    },
                  }}
                />
                <TCButton
                  disabled={isLoginButtonDisabled}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3, mb: 2, py: 1.5, fontWeight: 700, fontSize: 18, borderRadius: 2,
                    background: 'linear-gradient(90deg, #4CAF50 0%, #2196F3 100%)',
                    boxShadow: '0 2px 8px 0 rgba(33, 150, 243, 0.10)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)',
                    }
                  }}
                  onClick={(e)=> {e.preventDefault(); submitForm(); }}
                >
                  Sign In
                </TCButton>
                <Grid container sx={{ mt: 1 }}>
                  <Grid item xs>
                    <NextLink href={'../not-available'} style={{ color: '#2196F3', textDecoration: 'underline', fontWeight: 500 }}>Forgot Password</NextLink>
                  </Grid>
                  <Grid item>
                    <NextLink href={'../signup/owner'} style={{ color: '#4CAF50', textDecoration: 'underline', fontWeight: 500 }}>Don't have an account? Sign Up</NextLink>
                  </Grid>
                </Grid>
              </Box>
            </Container>
          )}
        </Formik>
      </Box>
      <PublicFooter />
    </Box>
  </ThemeProvider>
}

export default OwnerLogin