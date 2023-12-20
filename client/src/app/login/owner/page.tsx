"use client"
import PublicFooter from "@/components/landingpage/PublicFooter"
import PublicHeader from "@/components/landingpage/PublicHeader"
import { App } from "@/constants"
import * as Yup from 'yup';
import { Autocomplete, Box, Button, Container, FormHelperText, Grid, Link, TextField, ThemeProvider, Typography } from "@mui/material";
import owner from '../../../images/owner.png';
import Image from "next/image";
import { useRouter } from 'next/navigation'
import { Formik } from "formik";
import { APP_THEME, ILoggedInUser, IOwnerLoginData, ISociety, SocietyValidationSchema } from "@/Types";
import { useSelector } from "react-redux";
import {  ownerLoginRequest } from "@/api/ownerApis";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import {default as NextLink} from "next/link";
import { TCButton, TCTextField } from "@/styled";

export const OwnerLoginSchema = Yup.object({
  society: SocietyValidationSchema,
  towerNumber: Yup.string().matches(/^[a-zA-Z0-9]*$/, { message: 'Only alpha/numeric characters are allowed'}).required('Tower Number is required'),
  flatNumber:  Yup.string().matches(/^[0-9]*$/, { message: 'Only numeric characters are allowed'}).required('Flat Number is required'),
  password:Yup.string().min(6).required("Password id required"),
})

const OwnerLogin = () => {
  const dispatch = useDispatch();
  const router = useRouter()
  const allSocieties: Array<ISociety> = useSelector(reduxStore => (reduxStore as any)?.societies);
  const initialValues = {
    society: null,
    towerNumber: null,
    flatNumber: null,
    password: null,
} as IOwnerLoginData ;

  const loginHandler = async(formData: IOwnerLoginData) => {
    try{
      const response = await ownerLoginRequest(formData);
      if(response?.data.token){
        sessionStorage.setItem('loggedInUserInfo', JSON.stringify({user: response.data.data, role: 'OWNER', token: response.data.token } as ILoggedInUser))
        NotificationManager.success('Login Success', 'Redirecting to dashboard', 15000, () => { });
        router.push('/dashboard')
      } else {
        NotificationManager.error('Error', 'Invalid Credentials', 15000, () => { });
      }
      
    } catch(e){
      NotificationManager.error('Error', 'Error while signin', 15000, () => { });
    }
    
  }
  return <ThemeProvider theme={APP_THEME}>
    <Box className='full_viewport_height' style={{ backgroundColor: App.DarkBlue }}>
      <PublicHeader />
      <Box
      
        sx={{ pt: 8, pb: 6 , backgroundColor: 'white'}}
      >
        <Formik initialValues={initialValues} onSubmit={(formData) => {loginHandler(formData) }} enableReinitialize={true} validationSchema={OwnerLoginSchema}>
          {({ values, setFieldValue, errors, resetForm, submitForm }) => (
            <Container maxWidth="xs">
              <Box component="form" onSubmit={() => { }} noValidate sx={{ mt: 1 }}>
                <Box className='center_items'>
                  <Image src={owner} alt={"owner-logo"} height={100} width={100} />
                </Box>
                <Box className='center_items' sx={{ mt: 2 }}>
                  <Typography align="center" variant="h6" noWrap component="a" href="/" sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontWeight: 700, letterSpacing: '.3rem', textDecoration: 'none', }}>
                    OWNER LOGIN
                  </Typography>
                </Box>
                <Autocomplete
                  disablePortal
                  id="society-select"
                  options={allSocieties.map(society => {
                    return {
                      label: `${society.builderName} ${society.societyName} | ${society.city}, ${society.country}`,
                      value: society
                    }
                  })}
                  onChange={(_, value) => {
                    if (value) {
                      setFieldValue("society", value?.value)
                    } else {
                      setFieldValue("society", null)
                    }
                  }}
                  renderInput={(params) => <TextField {...params} label="Society Name" name={"society"} error={!!errors.society} />}
                />
                <FormHelperText sx={{ color: App.ErrorTextColor }}>{errors.society}</FormHelperText>
                <TextField 
                  color="error"
                  variant="outlined" 
                  error={!!errors.towerNumber} 
                  helperText={errors.towerNumber} 
                  value={values.towerNumber} 
                  onChange={(e) => setFieldValue("towerNumber", e.target.value.toUpperCase())} 
                  name="towerNumber" 
                  margin="normal" 
                  fullWidth 
                  label="Tower Number" 
                  autoFocus />
                <TextField type="number" error={!!errors.flatNumber} helperText={errors.flatNumber} value={values.flatNumber} onChange={(e) => setFieldValue("flatNumber", e.target.value)} name="flatNumber" margin="normal" fullWidth label="Flat Number" autoFocus />

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
                />

                <TCButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={(e)=> {e.preventDefault(); submitForm(); }}
                >
                  Sign In
                </TCButton>
                <Grid container>
                  <Grid item xs>
                  <NextLink href={'../not-available'}>{"Forgot Password"}</NextLink>
                  </Grid>
                  <Grid item>
                    <NextLink href={'../signup/owner'}>{"Don't have an account? Sign Up"}</NextLink>
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