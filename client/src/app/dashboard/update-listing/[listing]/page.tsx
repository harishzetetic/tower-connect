"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import _ from 'lodash'
import { Autocomplete, Button, Card, CardContent, Container, Fab, FormControl, FormControlLabel, FormHelperText, Grid, ImageList, ImageListItem, InputAdornment, InputLabel, OutlinedInput, Paper, Snackbar, Switch, TextField, ThemeProvider, Typography } from "@mui/material";
import { pushNotification } from "@/util";
import { SkeletonCard } from "@/components/dashboard/buySellInfoCard";
import Sidebar from "@/components/dashboard/sidebar";
import { APP_THEME, IBuySell, IOwnerData } from "@/Types";
import SellItemWizard from "@/components/dashboard/sellItemWizard";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import {  deleteListing, fetchListingById, toggleItemSold, updateListing } from "@/api/ownerApis";
import TopNavigation from '@/components/dashboard/topNavigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import {  App, BACKEND_URL, Categories, Condition } from '@/constants';
import { default as NextLink } from "next/link";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import dayjs from 'dayjs';
import Swal from 'sweetalert2'
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import relativeTime from "dayjs/plugin/relativeTime";
import DeleteIcon from '@mui/icons-material/Delete';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { BuySellValidationSchema } from '@/app/yupvalidationschema/buySellPostSchema';
import { TCButton, VisuallyHiddenInput } from '@/styled';
import { Formik, FormikErrors } from 'formik';
import { useSelector } from 'react-redux';
dayjs.extend(relativeTime)

// dayjs('2019-01-25').fromNow()}

const UpdateListing = ({ params }) => {
    const [listing, setListing] = React.useState<IBuySell | null>(null)
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isSold, setIsSold] = React.useState<boolean>(false);
    /* ---------------------------------------------------------------------------------- */
    const router = useRouter()
    const loggedInUser: IOwnerData= useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
    const [openSellWizard, setOpenSellWizard] = React.useState<boolean>(false);

    const markSold = async(listingId:string | undefined, value:boolean)=>{
        try{

            const apiResponse = await toggleItemSold(listingId, value);
            if (apiResponse?.data?.isTokenValid === false) {
                sessionStorage.removeItem('token');
                router.push('/login/owner')
            } else {
                setIsSold(value)
                Swal.fire({
                    title: 'Success',
                    text: `We have marked your product as ${value ? 'sold': 'available'}`,
                    icon: 'success',
                    confirmButtonText: 'Okay'
                })
                // pushNotification('success', 'Success', '👍 Action Done', 2000)

            }

        }catch(e){
            pushNotification('error', 'Error', 'Error occured')
        }
    }
    const fetchListing = async () => {
        const listingId = params.listing;
        try {
            const apiResponse = await fetchListingById(listingId);
            if (apiResponse?.data?.isTokenValid === false) {
                sessionStorage.removeItem('token');
                router.push('/login/owner')
            } else {
                setListing(apiResponse?.data)
                setIsSold((apiResponse?.data as IBuySell).isSold || false)
                setIsLoading(false)
            }

        } catch (e) {
            pushNotification('error', 'Error', 'Error while getting listings from server')
        }
    }

    React.useEffect(() => {
        fetchListing()
    }, []);

    React.useEffect(() => {
        if (!loggedInUser) {
            router.push('/login/owner')
        }
    })

    const initialValues = {
        images: listing?.images || [],
        title: listing?.title || null,
        price: listing?.price || null,
        category: listing?.category || null,
        condition: listing?.condition || null,
        description: listing?.description || null,
    } as IBuySell;

    const updateListingHandler = async (userFormData: IBuySell) => {
        try {
            userFormData.ownerid = loggedInUser?._id;
            userFormData.societyid = loggedInUser?.society?._id;
            const formData = new FormData();
            for (let key in userFormData) {
                switch(key){
                    case 'images':
                        userFormData[key].forEach(file => {
                            if (file) {
                                formData.append('images', file)
                            }
                        });
                        continue;
                    case 'owner':
                        formData.append(key, JSON.stringify(userFormData[key]));
                        continue;
                    default:
                        formData.append(key, userFormData[key]);
                        continue;

                }
            }
            const apiResponse = await updateListing(formData, listing?._id);
            if (apiResponse?.data?.isTokenValid === false) {
                sessionStorage.removeItem('token');
                router.push('/login/owner')
            } else if (apiResponse?.data?.message === 'SUCCESS') {
                Swal.fire({
                    title: 'Success',
                    text: 'You item has been updated',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                  })
                // pushNotification('success', 'Success', 'You listening has been updated')
            }
        } catch (e) {
            pushNotification('error', 'Error', 'Getting error while updating this listing')
        }
    }

    const toggleWithSold = (value: boolean) => {
        pushNotification('warn', 'Info', value ? 'Marking as sold' : 'Marking as unsold', 2000)
        markSold(listing?._id, value)
    }

    const deleteHandler = async () => {
        try {
            const apiResponse = await deleteListing({_id: listing?._id, images: listing?.images});
            if (apiResponse?.data?.isTokenValid === false) {
                sessionStorage.removeItem('token');
                router.push('/login/owner')
            } else if (apiResponse?.data?.message === 'SUCCESS') {
                Swal.fire({
                    title: 'Success',
                    text: 'Your listing has been deleted',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                  })
                router.push('/dashboard')
            }
        } catch (e) {
            pushNotification('error', 'Error', 'Getting error while updating this listing')
        }


    }

    if (loggedInUser) {
        return (<ThemeProvider theme={APP_THEME}>
            <TopNavigation />
            <Sidebar loggedInUser={loggedInUser} setOpenSellWizard={setOpenSellWizard} />
            <Toolbar />
            <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={6} md={2}></Grid>
                <Grid item xs={6} md={10}>
                    {isLoading && <SkeletonCard />}
                    {/*
                        <Snackbar
                        open={isLoading}
                        autoHideDuration={3000}
                        onClose={()=>{}}
                        message="Loading"
                    />
                    */}
                    
                    {!isLoading && listing && <>
                        &nbsp;&nbsp;<Typography variant='h3' sx={{fontWeight: 'bold'}}><Button variant="text"><NextLink href={{ pathname: `/dashboard/` }}><ArrowBackIcon fontSize='large' /></NextLink></Button> </Typography>
                        

                        <Container component="main">
                <Formik initialValues={initialValues} onSubmit={updateListingHandler} enableReinitialize={true} validationSchema={BuySellValidationSchema}>
                    {({ values, setFieldValue, errors, resetForm, submitForm, setFieldError, setErrors }) => {
                        return (<>
                        <Grid item xs={12} sm={12} sx={{ mb:2 }}>
                            <Switch
                                checked={isSold}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    resetForm();
                                    toggleWithSold(event.target.checked)
                                  }}
                                inputProps={{ 'aria-label': 'controlled' }}
                                />
                                <span><strong>Mark as sold</strong></span>
                            </Grid>
                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                                <ImageBlock files={values.images} setFieldValue={setFieldValue} errors={errors} setFieldError={setFieldError} imageIndex={0} disabled={isSold}/>
                            </Grid>
                            <Grid item xs={12} sm={12} sx={{ marginTop: 2 }}>
                                <TextField disabled={isSold} name="title" error={!!errors.title} helperText={errors.title} value={values.title} onChange={(e) => setFieldValue("title", e.target.value)} margin="normal" fullWidth label="Product Title" autoFocus />
                            </Grid>
                            
                            <Grid item xs={12} sm={12} sx={{ marginTop: 2 }}>
                                <FormControl fullWidth >
                                    <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-amount"
                                        type="number"
                                        error={!!errors.price}
                                        value={values.price}
                                        onChange={(e) => setFieldValue("price", e.target.value)}
                                        name="price"
                                        disabled={isSold}
                                        startAdornment={<InputAdornment position="start"><CurrencyRupeeIcon /></InputAdornment>}
                                        label="Amount"
                                    />
                                    <FormHelperText sx={{ color: App.ErrorTextColor }}>{errors.price}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} sx={{ marginTop: 2 }}>
                                <Autocomplete

                                    disablePortal
                                    id="society-select"
                                    options={Categories}
                                    disabled={isSold}
                                    onChange={(_, value) => {
                                        if (value) {
                                            setFieldValue("category", value?.value)
                                        } else {
                                            setFieldValue("category", null)
                                        }
                                    }}
                                    value={Categories.find(i => i.value === listing.category)}
                                    renderInput={(params) => <TextField {...params} label="Categories" name={"category"} error={!!errors.category} />}
                                />
                                <FormHelperText sx={{ color: App.ErrorTextColor }}>{errors.category}</FormHelperText>
                            </Grid>
                            <Grid item xs={12} sm={12} sx={{ marginTop: 2 }}>
                                <Autocomplete
                                    disabled={isSold}
                                    disablePortal
                                    id="society-select"
                                    options={Condition}
                                    onChange={(_, value) => {
                                        if (value) {
                                            setFieldValue("condition", value?.value)
                                        } else {
                                            setFieldValue("condition", null)
                                        }
                                    }}
                                    value={Condition.find(i => i.value === listing.condition)}
                                    renderInput={(params) => <TextField {...params} label="Condition" name={"condition"} error={!!errors.condition} />}
                                />
                                <FormHelperText sx={{ color: App.ErrorTextColor }}>{errors.condition}</FormHelperText>
                            </Grid>
                            <Grid item xs={12} sm={12} sx={{ marginTop: 2 }}>
                                <TextField disabled={isSold} rows={8} error={!!errors.description} helperText={errors.description} value={values.description} onChange={(e) => setFieldValue("description", e.target.value)} multiline name="description" margin="normal" fullWidth label="Description" autoFocus />
                            </Grid>

                            <Grid>
                                {/*
                                    <Button size="large" variant="outlined" autoFocus onClick={() => resetForm()}>
                                    Reset
                                </Button> &nbsp; &nbsp;
                                
                                */}
                            
                                <Button size="large" variant="contained" autoFocus onClick={deleteHandler} color='error'>
                                    <DeleteIcon />&nbsp; &nbsp;Delete Listing
                                </Button>&nbsp; &nbsp;
                                <Button size="large" variant="contained" autoFocus onClick={submitForm}>
                                    <TipsAndUpdatesIcon />&nbsp; &nbsp;Update Listing
                                </Button>
                            </Grid>
                        </>)
                    }}
                </Formik>

            </Container>
                       
                        

                    </>}
                </Grid>
            </Grid>
            <SellItemWizard openSellWizard={openSellWizard} setOpenSellWizard={setOpenSellWizard} pushNotification={pushNotification} />
        </ThemeProvider>)
    }
    return <>User probably not logged in. Kindly login again.</>

}

interface IImageBlock {
    files: Array<File | null | string>,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<IBuySell>>,
    errors: FormikErrors<IBuySell>,
    setFieldError: (field: string, message: string | undefined) => void,
    imageIndex: number,
    disabled:boolean
}

const ImageBlock = (props: IImageBlock) => {
    const [files, setFiles] = React.useState<Array<File | string | null>>(props.files || [null, null, null, null])
    let refs = new Map();
    refs.set(0, React.useRef(null))
    refs.set(1, React.useRef(null))
    refs.set(2, React.useRef(null))
    refs.set(3, React.useRef(null))
    const { imageIndex, setFieldValue, setFieldError, errors, disabled } = props;

    const onRemoveImageHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (refs.get(index)?.current?.value) {
            const filesClone = _.cloneDeep(files)
            filesClone[index] = null;
            setFiles(filesClone)
            setFieldValue('images', filesClone)
            refs.get(index).current.value = '';
        } else {
            const filesClone = _.cloneDeep(files)
            filesClone[index] = null;
            setFiles(filesClone)
            setFieldValue('images', filesClone)
        }
    }

    const getImageURL = (file: File | string | null) => {
        console.log(file)
        if(typeof file === 'string'){
            return `${BACKEND_URL}${file?.slice(1)}`
        }return URL.createObjectURL(file as File)
    }

    return <>
        {files.map((file, index) => <Grid item xs={2} sm={3} md={3}>
            <Box sx={{ cursor: 'pointer', backgroundColor: App.DarkBlue, color: 'white', height: 150, border: '0.5px solid gray', borderRadius: 2 }} onClick={() => {
                refs.get(index).current?.click();
            }}>
                {file ?
                    <>
                        <Fab color="error" aria-label="edit" size="small" sx={{ float: 'right', top: '-10px', right: '-10px' }} onClick={(e) => { onRemoveImageHandler(e, index) }}>{disabled ? <LockIcon /> : <CloseIcon />}</Fab>
                        <img style={{ marginTop: '-39px', width: '-webkit-fill-available', height: '150px' }} src={getImageURL(file)} />
                    </>
                    :
                    <Typography sx={{ mt: 7 }} textAlign='center'>Click to select</Typography>
                }
                {!disabled && <VisuallyHiddenInput type="file" onChange={(e) => {
                    const FILE_SIZE = 2000000; // 2000000 BYTES = 2MB      
                    const SUPPORTED_IMG_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']

                    if (e.target.files && ((e.target.files[0] as File)?.size) > FILE_SIZE) {
                        NotificationManager.warning('File Size Exceeded', 'Only 2 MB file size is allowed', 15000, () => { });
                        return;
                    }
                    if (e.target.files && !SUPPORTED_IMG_FORMATS.includes((e.target.files[0] as File)?.type)) {
                        NotificationManager.warning('File Type Mismatch', 'Only image items are allowed', 15000, () => { });
                        return;
                    }
                    const filesClone = _.cloneDeep(files)
                    filesClone[index] = e.target.files && e.target.files[0];
                    setFiles(filesClone)
                    setFieldValue('images', filesClone)

                }} ref={refs.get(index)} key={index} name={'image' + index}
                    accept="image/x-png,image/jpeg,image/jpg,image/png" />}
                
            </Box>
        </Grid>)}
        <FormHelperText sx={{ color: App.ErrorTextColor, ml: 5 }}>{errors.images}</FormHelperText>
    </>
}

export default UpdateListing