'use client'
import { App, Categories, Condition } from "@/constants";
import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide, Grid, Container, TextField, FormControl, InputAdornment, InputLabel, OutlinedInput, Autocomplete, Box, FormHelperText, Fab } from "@mui/material"
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { TCButton, VisuallyHiddenInput } from "@/styled";
import { Formik, FormikErrors } from "formik";
import { IBuySell } from "@/Types";
import { BuySellValidationSchema } from "@/app/yupvalidationschema/buySellPostSchema";

import CloseIcon from '@mui/icons-material/Close';


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
    const [images, setImages] = React.useState<FileList>()
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
                <Formik initialValues={initialValues} onSubmit={(formData) => { }} enableReinitialize={true} validationSchema={BuySellValidationSchema}>
                    {({ values, setFieldValue, errors, resetForm, submitForm, setFieldError }) => (<>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>

                            <ImageBlock values={values} setFieldValue={setFieldValue} errors={errors} setFieldError={setFieldError} imageIndex={'image1'} />
                            <ImageBlock values={values} setFieldValue={setFieldValue} errors={errors} setFieldError={setFieldError} imageIndex={'image2'} />
                            <ImageBlock values={values} setFieldValue={setFieldValue} errors={errors} setFieldError={setFieldError} imageIndex={'image3'} />
                            <ImageBlock values={values} setFieldValue={setFieldValue} errors={errors} setFieldError={setFieldError} imageIndex={'image4'} />
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
                                console.log(values)
                                submitForm()
                            }}>
                                Publish
                            </TCButton>
                        </Grid>
                    </>)}
                </Formik>

            </Container>
        </Grid>
    </Dialog>
}

interface IImageBlock {
    values: IBuySell,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<IBuySell>>,
    errors: FormikErrors<IBuySell>,
    setFieldError: (field: string, message: string | undefined) => void,
    imageIndex: string
}

const ImageBlock = (props: IImageBlock) => {
    const inputFileRef = React.useRef<HTMLInputElement>(null)
    const { values, imageIndex, setFieldValue, setFieldError, errors } = props;
    return <Grid item xs={2} sm={3} md={3}>
        <Box sx={{cursor: 'pointer', backgroundColor: App.DarkBlue, color: 'white', height: 150, border: '0.5px solid gray', borderRadius: 2 }} onClick={() => {
            inputFileRef.current?.click();
        }}>
            {
                values[imageIndex] && <Fab color="error" aria-label="edit" size="small" sx={{ float: 'right', top: '-10px', right: '-10px' }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFieldValue(imageIndex, null) }}>
                    <CloseIcon />
                </Fab>
            }
            {values[imageIndex] && <img style={{marginTop: '-39px', width: '-webkit-fill-available', height: '150px'}} src={URL.createObjectURL(values[imageIndex] as File)} />}
            {!values[imageIndex] && <Typography sx={{ mt: 7 }} textAlign='center'>Click to select</Typography>}
            <VisuallyHiddenInput type="file" onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                setFieldValue(imageIndex, file);
            }} ref={inputFileRef} key={values[imageIndex]} name={imageIndex}/>
        </Box>
        <FormHelperText sx={{ color: App.ErrorTextColor, ml: 5 }}>{errors[imageIndex]}</FormHelperText>
    </Grid>
}
export default SellItemWizard