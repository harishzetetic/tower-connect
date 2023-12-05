'use client'
import { App, Categories, Condition } from "@/constants";
import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide, Grid, Container, TextField, FormControl, InputAdornment, InputLabel, OutlinedInput, Autocomplete, Box, FormHelperText, Fab } from "@mui/material"
import { TransitionProps } from "@mui/material/transitions";
import React, { useEffect } from "react";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { TCButton, VisuallyHiddenInput } from "@/styled";
import { Formik, FormikErrors } from "formik";
import { IBuySell } from "@/Types";
import { BuySellValidationSchema } from "@/app/yupvalidationschema/buySellPostSchema";
import { NotificationContainer, NotificationManager } from 'react-notifications';

import CloseIcon from '@mui/icons-material/Close';
import { addListening } from "@/api/ownerApis";
import { getLoggedInUserData } from "@/util";


interface ISellItemWizard {
    openSellWizard: boolean;
    setOpenSellWizard: React.Dispatch<React.SetStateAction<boolean>>
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
    const initialValues = {
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        title: null,
        price: null,
        category: null,
        condition: null,
        description: null,
    } as IBuySell;

    const onSubmit = async (userFormData: IBuySell) => {
        const loggedInUser = getLoggedInUserData()
        userFormData.ownerid = loggedInUser?.user._id;
        userFormData.societyid = loggedInUser?.user.society?._id;
        const formData = new FormData();
            for (let key in userFormData) {
                formData.append(key, userFormData[key])
            }
            try {
                const apiResponse = await addListening(formData);
                if (apiResponse?.data?.message) {
                    NotificationManager.warning('Warning', apiResponse?.data.message, 15000, () => { });
                } else if(apiResponse?.data?.owner){
                    NotificationManager.success('Congratulations', 'You listening has been live', 15000, () => { });
                    props.setOpenSellWizard(false);
                }
            } catch (e) {
                NotificationManager.error('Error', 'Getting error while adding listening', 15000, () => { });
            }
    }

    return <Dialog
        fullWidth
        maxWidth={'lg'}
        open={props.openSellWizard}
        TransitionComponent={Transition}
    >
        <AppBar sx={{ position: 'sticky', top: 0, backgroundColor: App.DarkBlue }}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => { props.setOpenSellWizard(false) }}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    Sell an item
                </Typography>

            </Toolbar>
        </AppBar>
        <Grid container >
            <Container component="main" sx={{ mb: 4, mt: 4 }}>
                <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize={true} validationSchema={BuySellValidationSchema}>
                    {({ values, setFieldValue, errors, resetForm, submitForm, setFieldError, setErrors }) => {
                        return (<>
                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
    
                                <ImageBlock file={values.image1} setFieldValue={setFieldValue} errors={errors} setFieldError={setFieldError} imageIndex={'image1'} />
                                <ImageBlock file={values.image2} setFieldValue={setFieldValue} errors={errors} setFieldError={setFieldError} imageIndex={'image2'} />
                                <ImageBlock file={values.image3} setFieldValue={setFieldValue} errors={errors} setFieldError={setFieldError} imageIndex={'image3'} />
                                <ImageBlock file={values.image4} setFieldValue={setFieldValue} errors={errors} setFieldError={setFieldError} imageIndex={'image4'} />
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
                                <TextField error={!!errors.description} helperText={errors.description} value={values.description} onChange={(e) => setFieldValue("description", e.target.value)} multiline name="description" margin="normal" fullWidth label="Description" autoFocus />
                            </Grid>
    
                            <Grid>
                                <TCButton size="large" variant="contained" autoFocus onClick={()=>{
                                    const {image1, image2, image3, image4} = values;
                                    if(!!(image1 || image2 || image3 || image4)){
                                        submitForm();
                                    } else {
                                        setFieldError('image1', 'At least one item image should be uploaded')
                                    }
                                }}>
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
    file: File | null | undefined,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<IBuySell>>,
    errors: FormikErrors<IBuySell>,
    setFieldError: (field: string, message: string | undefined) => void,
    imageIndex: string
}

const ImageBlock = (props: IImageBlock) => {
    const inputFileRef = React.useRef<HTMLInputElement>(null)
    const { file, imageIndex, setFieldValue, setFieldError, errors } = props;

    const onRemoveImageHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        if(inputFileRef?.current?.value){
            setFieldValue(imageIndex, null); 
            inputFileRef.current.value = '';
        }
    }
    return <Grid item xs={2} sm={3} md={3}>
        <Box sx={{cursor: 'pointer', backgroundColor: App.DarkBlue, color: 'white', height: 150, border: '0.5px solid gray', borderRadius: 2 }} onClick={() => {
            inputFileRef.current?.click();
        }}>
        { file && (
            <>
                <Fab color="error" aria-label="edit" size="small" sx={{ float: 'right', top: '-10px', right: '-10px' }} onClick={onRemoveImageHandler}><CloseIcon /></Fab>
                <img style={{marginTop: '-39px', width: '-webkit-fill-available', height: '150px'}} src={URL.createObjectURL(file as File)} />
            </>
            )}
            {!file && <Typography sx={{ mt: 7 }} textAlign='center'>Click to select</Typography>}
            <VisuallyHiddenInput type="file" onChange={(e) => setFieldValue(imageIndex, e.target.files && e.target.files[0])} ref={inputFileRef} key={imageIndex} name={imageIndex}/>
        </Box>
        <FormHelperText sx={{ color: App.ErrorTextColor, ml: 5 }}>{errors[imageIndex]}</FormHelperText>
    </Grid>
}
export default SellItemWizard