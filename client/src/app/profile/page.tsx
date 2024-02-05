"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import { Avatar, Container, Divider, FormControl, FormHelperText, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material";
import { IOwnerData } from "@/Types";
import { updateProfileImage } from "@/api/ownerApis";
import { useRouter } from 'next/navigation';
import { App, BACKEND_URL } from '@/constants';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { useDispatch, useSelector } from 'react-redux';
import PersonIcon from '@mui/icons-material/Person';
import { HOC } from '@/components/hoc/hoc';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import PasswordIcon from '@mui/icons-material/Password';
import DeleteIcon from '@mui/icons-material/Delete';
import { TCButton, TCButtonOulined, VisuallyHiddenInput } from '@/styled';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Formik } from 'formik';
import { OwnerSignupValidationSchema } from '../yupvalidationschema/ownerSignupValidationSchema';
import { useMutation } from '@tanstack/react-query';
import { createParamsForInfoToast } from '@/util';
import Swal from 'sweetalert2';
import { updatedLoggedInUser } from '@/store/slices/loggedInUserSlice';
import { LoadingBackDrop } from '@/components/dashboard/buySellInfoCard';
dayjs.extend(relativeTime)

const Profile = HOC(({ params }) => {
    const dispatch = useDispatch();
    const router = useRouter()
    const profileImageRef = React.useRef<HTMLInputElement>(null)
    const loggedInUser: IOwnerData = useSelector(reduxStore => (reduxStore as any)?.loggedInUser);

    const updateProfilePictureMutation = useMutation({
        mutationFn: async (formData:FormData) => {
           return await updateProfileImage(formData)
        },
        onError: () => Swal.fire(createParamsForInfoToast('error', 'Error', 'Error occured')),
        onSuccess: (data) => {
            if(data?.data){
                dispatch(updatedLoggedInUser(data.data as IOwnerData))
                Swal.fire({
                    title: 'Success',
                    text: `You profile photo has been successfully uploaded`,
                    icon: 'success',
                    confirmButtonText: 'Okay'
                })
            }
        },
        onSettled: () => { }
    })

    const onChangeFileInput = async (e) => {
        const file = e.target.files?.[0];
        if(file){
        const FILE_SIZE = 2000000; // 2000000 BYTES = 2MB      
        const SUPPORTED_IMG_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']
        if (file && ((file as File)?.size) > FILE_SIZE) {
            Swal.fire(createParamsForInfoToast('info', 'File Size Exceeded', 'Only 2 MB file size is allowed'))
            return;
        }
        if (file && !SUPPORTED_IMG_FORMATS.includes((file as File)?.type)) {
            Swal.fire(createParamsForInfoToast('info', 'File Type Mismatch', 'Only image items are allowed'))
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', file)
        updateProfilePictureMutation.mutate(formData)
        }
        
    }
    
    React.useEffect(() => {}, []);
    console.log(`${BACKEND_URL}${loggedInUser.imageUrl?.slice(1)}`)
    return (<>
        <LoadingBackDrop isLoading={updateProfilePictureMutation.isPending} />
        {loggedInUser && 
        <Grid container>
        <Grid item xs={12} sm={12} md={4}>
            <Box sx={{ borderRadius: '8px', width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>                
                <Avatar src={`${BACKEND_URL}${loggedInUser.imageUrl?.slice(1)}`} sx={{ width: '6em', height: '6em' }} onClick={()=>profileImageRef.current && profileImageRef?.current.click()}>
                {loggedInUser.firstName?.charAt(0)} {loggedInUser.lastName?.charAt(0)}
                </Avatar>
                
                    <Typography>Change your profile image</Typography>
                    <VisuallyHiddenInput ref={profileImageRef} type="file" onChange={onChangeFileInput}/>
                    
                </Box>
                
                <nav aria-label="main mailbox folders">
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PersonIcon />
                                </ListItemIcon>
                                <ListItemText primary="Basic" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PrivacyTipIcon />
                                </ListItemIcon>
                                <ListItemText primary="Privacy" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PasswordIcon />
                                </ListItemIcon>
                                <ListItemText primary="Change Password" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <DeleteIcon />
                                </ListItemIcon>
                                <ListItemText primary="Delete Account" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </nav>
                <Divider />

            </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={8}>
            <Formik initialValues={{}} onSubmit={(formData) => { }} enableReinitialize={true} validationSchema={OwnerSignupValidationSchema}>
                {({ values, setFieldValue, errors, resetForm, submitForm }) => (
                    <>
                        <LocalizationProvider dateAdapter={AdapterDayjs}> {/*For mui date picker localization*/}
                            <Container component="main" sx={{ mb: 4 }}>
                                <FormControl fullWidth>
                                <TextField disabled error={false} helperText={''} value={`${loggedInUser.society?.builderName} ${loggedInUser.society?.societyName} ${loggedInUser.society?.addressline1} ${loggedInUser.society?.addressline2} ${loggedInUser.society?.city} ${loggedInUser.society?.state} ${loggedInUser.society?.country}`} onChange={(e) => { }} name="societyName" margin="normal" fullWidth label="Society Name" autoFocus />
                                    <FormHelperText sx={{ color: App.ErrorTextColor }}>{ }</FormHelperText>


                                </FormControl>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField disabled error={false} helperText={''} value={loggedInUser.towerNumber} onChange={(e) => { }} name="towerNumber" margin="normal" fullWidth label="Tower Number" autoFocus />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField disabled type="number" error={false} helperText={''} value={loggedInUser.flatNumber} onChange={(e) => { }} name="flatNumber" margin="normal" fullWidth label="Flat Number" autoFocus />
                                    </Grid>
                                </Grid>
                                <FormControl fullWidth >
                                <TextField disabled error={false} helperText={''} value={loggedInUser.flatType} onChange={(e) => { }} name="flatType" margin="normal" fullWidth label="Flat Type" autoFocus />
                                    <FormHelperText sx={{ color: App.ErrorTextColor }}>{''}</FormHelperText>
                                </FormControl>
                                <FormControl fullWidth >
                                <TextField disabled error={false} helperText={''} value={loggedInUser.dob} onChange={(e) => { }} name="dob" margin="normal" fullWidth label="DOB" autoFocus />
                                    <FormHelperText sx={{ color: App.ErrorTextColor }}>{''}</FormHelperText>
                                </FormControl>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField helperText={''} value={loggedInUser.firstName} onChange={(e) => { }} name="firstName" margin="normal" fullWidth label="First Name" autoFocus />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField helperText={''} value={loggedInUser.lastName} onChange={(e) => { }} name="lastName" margin="normal" fullWidth label="Last Name" autoFocus />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField type="email" value={loggedInUser.email} onChange={(e) => setFieldValue("email", e.target.value)} name="email" margin="normal" fullWidth label="Email" autoFocus />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField type="number" value={loggedInUser.phone} onChange={(e) => setFieldValue("phone", e.target.value)} name="phone" margin="normal" fullWidth label="Mobile Number" autoFocus />
                                    </Grid>
                                </Grid>
                                

                                <Grid container spacing={2} sx={{ pt: 2 }}>
                                    <Grid item xs={12} sm={6}>
                                        <TCButtonOulined size="large" fullWidth variant="outlined" onClick={() => { resetForm() }}>Reset</TCButtonOulined>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TCButton size="large" fullWidth variant="contained" onClick={submitForm}>Submit</TCButton>
                                    </Grid>
                                </Grid>



                            </Container>
                        </LocalizationProvider>
                    </>
                )}
            </Formik>
        </Grid>
    </Grid>
        }


    </>)


})


export default Profile