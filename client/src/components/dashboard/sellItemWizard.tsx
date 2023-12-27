'use client'
import { App, Categories, Condition } from "@/constants";
import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide, Grid, Container, TextField, FormControl, InputAdornment, InputLabel, OutlinedInput, Autocomplete, Box, FormHelperText, Fab } from "@mui/material"
import { TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useRef, useState } from "react";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { TCButton, VisuallyHiddenInput } from "@/styled";
import { Formik, FormikErrors } from "formik";
import { IBuySell, IOwnerData, notificationType } from "@/Types";
import { BuySellValidationSchema } from "@/app/yupvalidationschema/buySellPostSchema";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import _ from 'lodash'
import CloseIcon from '@mui/icons-material/Close';
import { addListening } from "@/api/ownerApis";
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from 'sweetalert2'
import { useSelector } from "react-redux";


interface ISellItemWizard {
    openSellWizard: boolean;
    setOpenSellWizard: React.Dispatch<React.SetStateAction<boolean>>;
    pushNotification: (type: notificationType, title: string, description: string) => void 
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const SellItemWizard = (props: ISellItemWizard) => {
    const loggedInUser: IOwnerData= useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
    const router = useRouter();
    const queryClient = useQueryClient()
    const initialValues = {
        images: [],
        title: null,
        price: null,
        category: null,
        condition: null,
        description: null,
    } as IBuySell;


    const onSubmit = async (userFormData: IBuySell) => {
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
            const apiResponse = await addListening(formData);
            if (apiResponse?.data?.isTokenValid === false) {
                sessionStorage.removeItem('token');
                router.push('/login/owner')
            } else if (apiResponse?.data?._id) {
                // props.pushNotification('success', 'Congratulations', 'You listening has been live')
                Swal.fire({
                    title: 'Success',
                    text: 'You item has been live now',
                    icon: 'success',
                    confirmButtonText: 'Okay'
                  })
                props.setOpenSellWizard(false);
            }
        } catch (e) {
            props.pushNotification('error', 'Error', 'Getting error while adding listening')
        }
    }

    const {mutateAsync:sellItemWizardMutation} = useMutation({
        mutationFn: onSubmit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fetchAllListings', 'fetchMyListings'] })
        },   
    })

    return <Dialog
        fullWidth
        maxWidth={'lg'}
        open={props.openSellWizard}
        TransitionComponent={Transition}
    >
        <AppBar sx={{ position: 'sticky', top: 0, backgroundColor: '#fff', color:'black', boxShadow: 'none' }}>
            <Toolbar>
                
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    Sell an item
                </Typography>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => { props.setOpenSellWizard(false) }}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>

            </Toolbar>
        </AppBar>
        <Grid container >
            <Container component="main" sx={{ mb: 4, mt: 4 }}>
                <Formik initialValues={initialValues} onSubmit={sellItemWizardMutation} enableReinitialize={true} validationSchema={BuySellValidationSchema}>
                    {({ values, setFieldValue, errors, resetForm, submitForm, setFieldError, setErrors }) => {
                        return (<>
                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                                <ImageBlock files={values.images} setFieldValue={setFieldValue} errors={errors} setFieldError={setFieldError} imageIndex={0} />
                            </Grid>

                            <Grid item xs={12} sm={12} sx={{ marginTop: 2 }}>
                                <TextField name="title" error={!!errors.title} helperText={errors.title} value={values.title} onChange={(e) => setFieldValue("title", e.target.value)} margin="normal" fullWidth label="Product Title" autoFocus />
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
                                    onChange={(_, value) => {
                                        if (value) {
                                            setFieldValue("category", value?.value)
                                        } else {
                                            setFieldValue("category", null)
                                        }
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Categories" name={"category"} error={!!errors.category} />}
                                />
                                <FormHelperText sx={{ color: App.ErrorTextColor }}>{errors.category}</FormHelperText>
                            </Grid>
                            <Grid item xs={12} sm={12} sx={{ marginTop: 2 }}>
                                <Autocomplete

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
                                    renderInput={(params) => <TextField {...params} label="Condition" name={"condition"} error={!!errors.condition} />}
                                />
                                <FormHelperText sx={{ color: App.ErrorTextColor }}>{errors.condition}</FormHelperText>
                            </Grid>
                            <Grid item xs={12} sm={12} sx={{ marginTop: 2 }}>
                                <TextField rows={8} error={!!errors.description} helperText={errors.description} value={values.description} onChange={(e) => setFieldValue("description", e.target.value)} multiline name="description" margin="normal" fullWidth label="Description" autoFocus />
                            </Grid>

                            <Grid>
                                <TCButton size="large" variant="contained" autoFocus onClick={submitForm}>
                                    Publish
                                </TCButton>
                            </Grid>
                        </>)
                    }}
                </Formik>

            </Container>
        </Grid>
    </Dialog>
}

interface IImageBlock {
    files: Array<File | null | string>,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<IBuySell>>,
    errors: FormikErrors<IBuySell>,
    setFieldError: (field: string, message: string | undefined) => void,
    imageIndex: number
}

 const ImageBlock = (props: IImageBlock) => {
    const [files, setFiles] = useState<Array<File | null>>([null, null, null, null])
    let refs = new Map();
    refs.set(0, React.useRef(null))
    refs.set(1, React.useRef(null))
    refs.set(2, React.useRef(null))
    refs.set(3, React.useRef(null))
    const { imageIndex, setFieldValue, setFieldError, errors } = props;

    const onRemoveImageHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (refs.get(index)?.current?.value) {
            const filesClone = _.cloneDeep(files)
            filesClone[index] = null;
            setFiles(filesClone)
            setFieldValue('images', filesClone)
            refs.get(index).current.value = '';
        }
    }
    // return <React.Fragment></React.Fragment>
    return <>
        {files.map((file, index) => <Grid item xs={2} sm={3} md={3}>
            <Box sx={{ cursor: 'pointer', backgroundColor: App.DarkBlue, color: 'white', height: 150, border: '0.5px solid gray', borderRadius: 2 }} onClick={() => {
                refs.get(index).current?.click();
            }}>
                {file ?
                    <>
                        <Fab color="error" aria-label="edit" size="small" sx={{ float: 'right', top: '-10px', right: '-10px' }} onClick={(e) => { onRemoveImageHandler(e, index) }}><CloseIcon /></Fab>
                        <img style={{ marginTop: '-39px', width: '-webkit-fill-available', height: '150px' }} src={URL.createObjectURL(file as File)} />
                    </>
                    :
                    <Typography sx={{ mt: 7 }} textAlign='center'>Click to select</Typography>
                }
                <VisuallyHiddenInput type="file" onChange={(e) => {
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
                    accept="image/x-png,image/jpeg,image/jpg,image/png" />
            </Box>
        </Grid>)}
        <FormHelperText sx={{ color: App.ErrorTextColor, ml: 5 }}>{errors.images}</FormHelperText>
    </>
}
export default SellItemWizard