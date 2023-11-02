"use client"
import { IGoogleUserData, IOwnerSignupFormData, ISociety } from "@/Types";
import PublicFooter from "@/components/landingpage/PublicFooter"
import PublicHeader from "@/components/landingpage/PublicHeader"
import { App } from "@/constants"
import { Backdrop, Box, Button, CircularProgress, Container, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography, styled } from "@mui/material";
import { Formik, FormikErrors } from "formik";
import { useSelector } from "react-redux";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from "@mui/x-date-pickers";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { OwnerSignupValidationSchema } from "./ownerSignupValidationSchema";
import 'react-dropzone-uploader/dist/styles.css'
import dayjs from "dayjs";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { VisuallyHiddenInput } from "@/styled";
import { newOwnerSignupRequest } from "@/api/ownerApis";
import TCConfirm from "@/components/common/TCConfirm";
import { useState } from "react";
import { error } from "console";

;

const OwnerSignup = () => {
    const allSocieties = useSelector(reduxStore => (reduxStore as any)?.societies);
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
    const [userFormData, setUserFormData] = useState<null | IOwnerSignupFormData>(null)
    const initialValues = {
        society: null,
        towerNumber: null,
        flatNumber: null,
        flatType: null,
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        imageUrl: null,
        proofDocument: null,
    } as IOwnerSignupFormData;



    const onGoogleLoginSuccess = async (info: any, setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<IOwnerSignupFormData>>, values: any) => {
        const { given_name, family_name, email, picture } = jwtDecode(info.credential as string) as IGoogleUserData;
        console.log(given_name, family_name, email, picture)
        setFieldValue("firstName", given_name);
        setFieldValue("lastName", family_name);
        setFieldValue("email", email);
        setFieldValue("imageUrl", picture);
        console.log(values)
        NotificationManager.success('Success', 'Information Updated', 3000, () => { });
    }
    const onGoogleLoginFailed = () => {
        NotificationManager.error('Error', 'Something went wrong while fetch your information from Google', 3000, () => { });
    }

    const openConfirm = (data: IOwnerSignupFormData) => {
        setIsConfirmOpen(true);
        setUserFormData(data)
    }

    return <>
        <Box className='full_viewport_height' style={{ background: App.Background }}>
            <PublicHeader />

            <Box >
                <GoogleOAuthProvider clientId={"775263055849-bes2gfvlbs5n84pmlp9lh7qfhpjb94kh.apps.googleusercontent.com"}>
                    <Container>
                        <Formik initialValues={initialValues} onSubmit={(formData) => { openConfirm(formData) }} enableReinitialize={true} validationSchema={OwnerSignupValidationSchema}>
                            {({ values, setFieldValue, errors, resetForm, submitForm }) => (
                                <>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}> {/*For mui date picker localization*/}
                                        <Container component="main" sx={{ mb: 4 }}>
                                            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                                                <Typography component="h4" variant="h5" align="center">Owner Signup</Typography>
                                                <br />
                                                {/*<GoogleLogin shape='circle' size={'large'} type={'icon'} onSuccess={(info) => onGoogleLoginSuccess(info, setFieldValue, values)} onError={onGoogleLoginFailed} theme="filled_blue" text={undefined} />
                                                <Typography paragraph >
                                                    &nbsp; Fetch your info with Google
                                                </Typography>
                                                */}

                                                <FormControl fullWidth>
                                                    <InputLabel id="society-name-label">Society Name</InputLabel>
                                                    <Select
                                                        error={!!errors.society}
                                                        labelId="society-name-label"
                                                        id="society-select"
                                                        value={values.society?._id}
                                                        label="Select Societies"
                                                        onChange={(e) => {
                                                            const target: ISociety = allSocieties.find((i: ISociety) => i._id === e.target.value);
                                                            setFieldValue("society", target)
                                                        }}
                                                        name={"society"}
                                                        fullWidth
                                                    >
                                                        {allSocieties.map((item: ISociety, index: number) => (
                                                            <MenuItem key={index} value={item._id}>{item.builderName} {item.societyName} | {item.city}</MenuItem>
                                                        ))}
                                                    </Select>
                                                    <FormHelperText sx={{ color: App.ErrorTextColor }}>{errors.society}</FormHelperText>
                                                </FormControl>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField error={!!errors.towerNumber} helperText={errors.towerNumber} value={values.towerNumber} onChange={(e) => setFieldValue("towerNumber", e.target.value)} name="towerNumber" margin="normal" fullWidth label="Tower Number" autoFocus />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField error={!!errors.flatNumber} helperText={errors.flatNumber} value={values.flatNumber} onChange={(e) => setFieldValue("flatNumber", e.target.value)} name="flatNumber" margin="normal" fullWidth label="Flat Number" autoFocus />
                                                    </Grid>
                                                </Grid>
                                                <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
                                                    <InputLabel id="flat-type-label">Flat Type</InputLabel>
                                                    <Select
                                                        error={!!errors.flatType}
                                                        labelId="flat-type-label"
                                                        id="flat-type"
                                                        value={values.flatType}
                                                        label="Select Flat Type"
                                                        onChange={(e) => setFieldValue("flatType", e.target.value)}
                                                        name={"flatType"}
                                                        fullWidth
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
                                                        <TextField error={!!errors.firstName} helperText={errors.firstName} value={values.firstName} onChange={(e) => setFieldValue("firstName", e.target.value)} name="firstName" margin="normal" fullWidth label="First Name" autoFocus />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField error={!!errors.lastName} helperText={errors.lastName} value={values.lastName} onChange={(e) => setFieldValue("lastName", e.target.value)} name="lastName" margin="normal" fullWidth label="Last Name" autoFocus />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField type="email" error={!!errors.email} helperText={errors.email} value={values.email} onChange={(e) => setFieldValue("email", e.target.value)} name="email" margin="normal" fullWidth label="Email" autoFocus />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField error={!!errors.phone} helperText={errors.phone} type="number" value={values.phone} onChange={(e) => setFieldValue("phone", e.target.value)} name="phone" margin="normal" fullWidth label="Mobile Number" autoFocus />
                                                    </Grid>
                                                </Grid>
                                                <DatePicker
                                                    label="DOB"
                                                    value={values.dob}
                                                    onChange={(date) => {
                                                        setFieldValue("dob", dayjs(date).format('YYYY-MM-DD'))
                                                    }}
                                                    slotProps={{
                                                        textField: {
                                                            error: !!errors.dob,
                                                            name: "dob",
                                                            fullWidth: true,
                                                            sx: { mt: 2 },
                                                        },
                                                    }}
                                                />
                                                <FormHelperText sx={{ color: App.ErrorTextColor }}>{errors.dob}</FormHelperText>
                                                <Grid sx={{ mt: 2 }}>

                                                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                                        Upload Proof Document
                                                        <VisuallyHiddenInput type="file" onChange={(e) => setFieldValue("proofDocument", e.target.files?.[0])} />
                                                    </Button> {values?.proofDocument?.name ? <Box sx={{ verticalAlign: 'sub', display: 'inline' }}><AttachFileIcon />{values?.proofDocument?.name}</Box> : 'No Document Selected'}

                                                    <FormHelperText sx={{ color: App.ErrorTextColor }}>{errors.proofDocument}</FormHelperText>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField type="password" error={!!errors.password} helperText={errors.password} value={values.password} onChange={(e) => setFieldValue("password", e.target.value)} name="password" margin="normal" fullWidth label="Password" autoFocus />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField type="password" error={!!errors.confirmPassword} helperText={errors.confirmPassword} value={values.confirmPassword} onChange={(e) => setFieldValue("confirmPassword", e.target.value)} name="confirmPassword" margin="normal" fullWidth label="Confirm Password" autoFocus />
                                                    </Grid>
                                                </Grid>


                                                <Grid container spacing={2} sx={{ pt: 2 }}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Button size="large" fullWidth variant="outlined" onClick={() => { resetForm() }}>Reset</Button>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Button size="large" fullWidth variant="contained" onClick={submitForm}>Submit</Button>
                                                    </Grid>
                                                </Grid>

                                            </Paper>
                                            <TCConfirm open={isConfirmOpen} handleClose={() => setIsConfirmOpen(false)} handleConfirm={async () => {
                                                const formData = new FormData();
                                                for (let key in userFormData) {
                                                    formData.append(key, userFormData[key])
                                                }
                                                try {
                                                    const apiResponse = await newOwnerSignupRequest(formData);
                                                    if (apiResponse?.data.message) {
                                                        NotificationManager.warning('Warning', apiResponse?.data.message, 3000, () => { });
                                                    }
                                                    setIsConfirmOpen(false)
                                                } catch (e) {
                                                    NotificationManager.error('Error', 'Getting error while register for new owner', 3000, () => { });
                                                }

                                            }} title={'Confirm'} description={"Are your sure to proceed with entered info. Incorrent information may be reject your account creation."} />
                                            {/*
                                            
                                              <Backdrop
                                                open={true}
                                                sx={{ backgroundColor: '#000000e6', overflow: 'hidden', color: "#fff", zIndex: '9'}}
                                                onClick={() => { }}
                                            >
                                                asdfasdfasdfasdf
                                            </Backdrop>
                                            */}
                                          
                                        </Container>
                                    </LocalizationProvider>
                                </>
                            )}
                        </Formik>
                    </Container>
                </GoogleOAuthProvider>

            </Box>
            <PublicFooter />
        </Box>
        <NotificationContainer />
    </>
}

export default OwnerSignup