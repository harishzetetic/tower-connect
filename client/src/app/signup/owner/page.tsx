"use client"
import { APP_THEME, IGoogleUserData, IOwnerData, ISociety } from "@/Types";
import PublicFooter from "@/components/landingpage/PublicFooter"
import { App } from "@/constants"
import { Alert, Autocomplete, Box, Button, Chip, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Paper, Select, TextField, ThemeProvider, Typography, styled } from "@mui/material";
import { Formik, FormikErrors } from "formik";
import { useSelector } from "react-redux";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from "@mui/x-date-pickers";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { OwnerSignupValidationSchema } from "../../yupvalidationschema/ownerSignupValidationSchema";
import dayjs from "dayjs";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { TCButton, TCButtonOulined, VisuallyHiddenInput } from "@/styled";
import { newOwnerSignupRequest } from "@/api/ownerApis";
import TCConfirm, { ITCConfirmProps } from "@/components/common/TCConfirm";
import {useRouter} from 'next/navigation'
import { useState } from "react";
import Swal from "sweetalert2";
import { createParamsForInfoToast } from "@/util";

const OwnerSignup = () => {
    const router = useRouter()
    const allSocieties: Array<ISociety> = useSelector(reduxStore => (reduxStore as any)?.societies);
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
    const [isRequestSubmitConfirmOpen, setIsRequestSubmitConfirmOpen] = useState<boolean>(false);
    const [requestSubmitConfirmProps, setRequestSubmitConfirmProps] = useState<ITCConfirmProps>();
    const [userFormData, setUserFormData] = useState<null | IOwnerData>(null)
    const initialValues = {
        societyId: null,
        towerNumber: null,
        flatNumber: null,
        flatType: null,
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        imageUrl: null,
        proofDocument: null,
    } as IOwnerData;


    /*
    const onGoogleLoginSuccess = async (info: any, setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<IOwnerSignupFormData>>, values: any) => {
        const { given_name, family_name, email, picture } = jwtDecode(info.credential as string) as IGoogleUserData;
        console.log(given_name, family_name, email, picture)
        setFieldValue("firstName", given_name);
        setFieldValue("lastName", family_name);
        setFieldValue("email", email);
        setFieldValue("imageUrl", picture);
        console.log(values)
    }
    const onGoogleLoginFailed = () => {
    }
    */
    

    const openConfirm = (data: IOwnerData) => {
        setIsConfirmOpen(true);
        setUserFormData(data)
    }

    const onConfirmSubmit = async () => {
        const formData = new FormData();
        for (let key in userFormData) {
            if(key === 'society'){
                formData.append(key, JSON.stringify(userFormData[key]))
                continue;
            }
            formData.append(key, userFormData[key])
        }
        try {
            const apiResponse = await newOwnerSignupRequest(formData);
            console.log(apiResponse)
            if (apiResponse?.data?.message) {
                Swal.fire(createParamsForInfoToast('info', 'Warning', apiResponse?.data.message, 15000))
            } else if(apiResponse?.data?.owner){
                Swal.fire(createParamsForInfoToast('success', 'New Account Request Submitted', 'Your request for your account creation with Tower Connect has been submitted.', 15000))
                setIsRequestSubmitConfirmOpen(true)
                Swal.fire({
                    title: "Request Submitted",
                    text: 'We are starting your provided data verification with uploaded document proof. If all good, it will take usually 24-48 hours to approve. In case information found mismatch account request would be reject.You can check your account status by login with your credentials.',
                    confirmButtonText: "Yes",
                    showCancelButton: true,
                    icon: 'success',
                    timerProgressBar: true,
                    timer: 30000,
                  }).then((result) => {
                    router.push('/login/owner')
                  })
                
            }
            setIsConfirmOpen(false)
        } catch (e) {
            Swal.fire(createParamsForInfoToast('error', 'Error', 'Getting error while register for new owner', 15000))
        }
    }

    return <ThemeProvider theme={APP_THEME}>
        <Box className='full_viewport_height' sx={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at 74.2% 50.9%, rgb(14, 72, 222) 5.2%, rgb(3, 22, 65) 75.3%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        }}>
            {/* <PublicHeader /> */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
                <GoogleOAuthProvider clientId={"775263055849-bes2gfvlbs5n84pmlp9lh7qfhpjb94kh.apps.googleusercontent.com"}>
                    <Container maxWidth="md" sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Formik initialValues={initialValues} onSubmit={(formData) => { openConfirm(formData) }} enableReinitialize={true} validationSchema={OwnerSignupValidationSchema}>
                            {({ values, setFieldValue, errors, resetForm, submitForm }) => (
                                <>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}> {/*For mui date picker localization*/}
                                        <Container component="main" sx={{ mb: 4, px: 0 }}>
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
                                                <Typography component="h4" variant="h5" align="center" sx={{
                                                    fontWeight: 900,
                                                    letterSpacing: '.2rem',
                                                    background: 'linear-gradient(90deg, #4CAF50 0%, #2196F3 100%)',
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    mb: 2,
                                                    textShadow: '0 2px 8px rgba(33,150,243,0.10)',
                                                }}>Owner Signup</Typography>
                                                <FormControl fullWidth>
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
                                                            if(value){
                                                                setFieldValue("societyId", value.value)
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
                                                </FormControl>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField error={!!errors.towerNumber} helperText={errors.towerNumber} value={values.towerNumber} onChange={(e) => setFieldValue("towerNumber", e.target.value.toUpperCase())} name="towerNumber" margin="normal" fullWidth label="Tower Number" autoFocus sx={{
                                                            input: { color: '#fff' },
                                                            label: { color: '#b0b8c9' },
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2,
                                                                background: 'rgba(44, 52, 70, 0.85)',
                                                                color: '#fff',
                                                            },
                                                        }} />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField type="number" error={!!errors.flatNumber} helperText={errors.flatNumber} value={values.flatNumber} onChange={(e) => setFieldValue("flatNumber", e.target.value)} name="flatNumber" margin="normal" fullWidth label="Flat Number" autoFocus sx={{
                                                            input: { color: '#fff' },
                                                            label: { color: '#b0b8c9' },
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2,
                                                                background: 'rgba(44, 52, 70, 0.85)',
                                                                color: '#fff',
                                                            },
                                                        }} />
                                                    </Grid>
                                                </Grid>
                                                <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
                                                    <InputLabel id="flat-type-label" sx={{ color: '#b0b8c9' }}>Flat Type</InputLabel>
                                                    <Select
                                                        error={!!errors.flatType}
                                                        labelId="flat-type-label"
                                                        id="flat-type"
                                                        value={values.flatType}
                                                        label="Select Flat Type"
                                                        onChange={(e) => setFieldValue("flatType", e.target.value)}
                                                        name={"flatType"}
                                                        fullWidth
                                                        sx={{
                                                            borderRadius: 2,
                                                            background: 'rgba(44, 52, 70, 0.85)',
                                                            color: '#fff',
                                                            '.MuiSelect-icon': { color: '#b0b8c9' },
                                                        }}
                                                    >
                                                        <MenuItem value={'1 BHK'}>1 BHK</MenuItem>
                                                        <MenuItem value={'2 BHK'}>2 BHK</MenuItem>
                                                        <MenuItem value={'3 BHK'}>3 BHK</MenuItem>
                                                        <MenuItem value={'4 BHK'}>4 BHK</MenuItem>
                                                        <MenuItem value={'5 BHK'}>5 BHK</MenuItem>
                                                    </Select>
                                                    <FormHelperText sx={{ color: App.ErrorTextColor }}>{errors.flatType}</FormHelperText>
                                                </FormControl>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField error={!!errors.firstName} helperText={errors.firstName} value={values.firstName} onChange={(e) => setFieldValue("firstName", e.target.value)} name="firstName" margin="normal" fullWidth label="First Name" autoFocus sx={{
                                                            input: { color: '#fff' },
                                                            label: { color: '#b0b8c9' },
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2,
                                                                background: 'rgba(44, 52, 70, 0.85)',
                                                                color: '#fff',
                                                            },
                                                        }} />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField error={!!errors.lastName} helperText={errors.lastName} value={values.lastName} onChange={(e) => setFieldValue("lastName", e.target.value)} name="lastName" margin="normal" fullWidth label="Last Name" autoFocus sx={{
                                                            input: { color: '#fff' },
                                                            label: { color: '#b0b8c9' },
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2,
                                                                background: 'rgba(44, 52, 70, 0.85)',
                                                                color: '#fff',
                                                            },
                                                        }} />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField type="email" error={!!errors.email} helperText={errors.email} value={values.email} onChange={(e) => setFieldValue("email", e.target.value)} name="email" margin="normal" fullWidth label="Email" autoFocus sx={{
                                                            input: { color: '#fff' },
                                                            label: { color: '#b0b8c9' },
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2,
                                                                background: 'rgba(44, 52, 70, 0.85)',
                                                                color: '#fff',
                                                            },
                                                        }} />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField error={!!errors.phone} helperText={errors.phone} type="number" value={values.phone} onChange={(e) => setFieldValue("phone", e.target.value)} name="phone" margin="normal" fullWidth label="Mobile Number" autoFocus sx={{
                                                            input: { color: '#fff' },
                                                            label: { color: '#b0b8c9' },
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2,
                                                                background: 'rgba(44, 52, 70, 0.85)',
                                                                color: '#fff',
                                                            },
                                                        }} />
                                                    </Grid>
                                                </Grid>
                                                <DatePicker
                                                    label="DOB"
                                                    format="DD/MM/YYYY"
                                                    value={values.dob}
                                                    onChange={(date) => {
                                                        setFieldValue("dob", dayjs(date).format('YYYY-MM-DD'))
                                                    }}
                                                    slotProps={{
                                                        textField: {
                                                            error: !!errors.dob,
                                                            name: "dob",
                                                            fullWidth: true,
                                                            sx: {
                                                                mt: 2,
                                                                input: { color: '#fff' },
                                                                label: { color: '#b0b8c9' },
                                                                '& .MuiOutlinedInput-root': {
                                                                    borderRadius: 2,
                                                                    background: 'rgba(44, 52, 70, 0.85)',
                                                                    color: '#fff',
                                                                },
                                                            },
                                                        },
                                                    }}
                                                />
                                                <FormHelperText sx={{ color: App.ErrorTextColor }}>{errors.dob}</FormHelperText>
                                                <Box sx={{
                                                    mt: 2,
                                                    mb: 2,
                                                    width: '100%',
                                                    border: '2px dashed #2196F3',
                                                    borderRadius: 2,
                                                    background: 'rgba(44, 52, 70, 0.15)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    px: 2,
                                                    py: 3,
                                                    cursor: 'pointer',
                                                    transition: 'border-color 0.2s',
                                                    '&:hover': { borderColor: '#4CAF50' },
                                                }}>
                                                    <TCButton 
                                                        {...{component: "label"}} 
                                                        variant="text" 
                                                        startIcon={<CloudUploadIcon sx={{ fontSize: 32, color: '#2196F3' }} />} 
                                                        sx={{
                                                            color: '#2196F3',
                                                            fontWeight: 700,
                                                            fontSize: 18,
                                                            textTransform: 'none',
                                                            boxShadow: 'none',
                                                            background: 'none',
                                                            p: 0,
                                                            minWidth: 0,
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                            <span>Click or drag file to upload proof document</span>
                                                            <span style={{ fontSize: 13, color: '#b0b8c9', fontWeight: 400 }}>PDF, JPG, PNG, max 5MB</span>
                                                        </Box>
                                                        <VisuallyHiddenInput type="file" onChange={(e) => setFieldValue("proofDocument", e.target.files?.[0])} />
                                                    </TCButton>
                                                    {values?.proofDocument?.name ? (
                                                        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', color: '#4CAF50', fontWeight: 600 }}>
                                                            <AttachFileIcon sx={{ mr: 0.5 }} />{values?.proofDocument?.name}
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{ ml: 2, color: '#b0b8c9', fontSize: 15 }}>No Document Selected</Box>
                                                    )}
                                                </Box>
                                                <FormHelperText sx={{ color: App.ErrorTextColor }}>{errors.proofDocument}</FormHelperText>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField type="password" error={!!errors.password} helperText={errors.password} value={values.password} onChange={(e) => setFieldValue("password", e.target.value)} name="password" margin="normal" fullWidth label="Password" autoFocus sx={{
                                                            input: { color: '#fff' },
                                                            label: { color: '#b0b8c9' },
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2,
                                                                background: 'rgba(44, 52, 70, 0.85)',
                                                                color: '#fff',
                                                            },
                                                        }} />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField type="password" error={!!errors.confirmPassword} helperText={errors.confirmPassword} value={values.confirmPassword} onChange={(e) => setFieldValue("confirmPassword", e.target.value)} name="confirmPassword" margin="normal" fullWidth label="Confirm Password" autoFocus sx={{
                                                            input: { color: '#fff' },
                                                            label: { color: '#b0b8c9' },
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2,
                                                                background: 'rgba(44, 52, 70, 0.85)',
                                                                color: '#fff',
                                                            },
                                                        }} />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2} sx={{ pt: 2 }}>
                                                    <Grid item xs={12} sm={6}>
                                                        <TCButtonOulined size="large" fullWidth variant="outlined" onClick={() => { resetForm() }} sx={{
                                                            borderRadius: 2,
                                                            fontWeight: 700,
                                                            fontSize: 16,
                                                            py: 1.2,
                                                            color: '#2196F3',
                                                            borderColor: '#2196F3',
                                                            background: 'rgba(44, 52, 70, 0.85)',
                                                            '&:hover': {
                                                                background: 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)',
                                                                color: '#fff',
                                                                borderColor: '#4CAF50',
                                                            },
                                                        }}>Reset</TCButtonOulined>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TCButton size="large" fullWidth variant="contained" onClick={submitForm} sx={{
                                                            borderRadius: 2,
                                                            fontWeight: 700,
                                                            fontSize: 16,
                                                            py: 1.2,
                                                            background: 'linear-gradient(90deg, #4CAF50 0%, #2196F3 100%)',
                                                            boxShadow: '0 2px 8px 0 rgba(33, 150, 243, 0.10)',
                                                            '&:hover': {
                                                                background: 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)',
                                                            },
                                                        }}>Submit</TCButton>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            <TCConfirm open={isConfirmOpen} handleClose={() => setIsConfirmOpen(false)} handleConfirm={onConfirmSubmit} title={'Confirm'} description={"Are your sure to proceed with entered info. Incorrent information may be reject your account creation."} />
                                        </Container>
                                    </LocalizationProvider>
                                </>
                            )}
                        </Formik>
                    </Container>
                </GoogleOAuthProvider>
                {isRequestSubmitConfirmOpen && requestSubmitConfirmProps && <TCConfirm {...requestSubmitConfirmProps} />}
            </Box>
            <PublicFooter />
        </Box>
    </ThemeProvider>
}

export default OwnerSignup