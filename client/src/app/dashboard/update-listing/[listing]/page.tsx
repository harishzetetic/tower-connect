"use client"
import * as React from 'react';
import ReplyIcon from '@mui/icons-material/Reply';
import Box from '@mui/material/Box';
import _ from 'lodash'
import { Autocomplete, Button, Container, Fab, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, OutlinedInput, Switch, TextField, Typography } from "@mui/material";
import { IBuySell, IOwnerData } from "@/Types";
import { deleteListing, fetchListingById, toggleItemSold, updateListing } from "@/api/ownerApis";
import { useRouter } from 'next/navigation';
import { App, BACKEND_URL, Categories, Condition, QUERY_KEYS } from '@/constants';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import dayjs from 'dayjs';
import Swal from 'sweetalert2'
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import relativeTime from "dayjs/plugin/relativeTime";
import DeleteIcon from '@mui/icons-material/Delete';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { BuySellValidationSchema } from '@/app/yupvalidationschema/buySellPostSchema';
import { NextLink, VisuallyHiddenInput } from '@/styled';
import { Formik, FormikErrors } from 'formik';
import { useSelector } from 'react-redux';
import { HOC } from '@/components/hoc/hoc';
import { createParamsForInfoToast } from '@/util';
import { LoadingBackDrop } from '@/components/dashboard/buySellInfoCard';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
dayjs.extend(relativeTime)

// dayjs('2019-01-25').fromNow()}

const UpdateListing = HOC(({ params }) => {
    const [isSold, setIsSold] = React.useState<boolean>(false);
    const router = useRouter()
    const loggedInUser: IOwnerData = useSelector(reduxStore => (reduxStore as any)?.loggedInUser);

    const { data: listing, isLoading, isError, isSuccess } = useQuery({
        queryFn: async () => {
            const apiResponse = await fetchListingById(params.listing);
            return apiResponse?.data as IBuySell
        },
        queryKey: [QUERY_KEYS.FETCH_MY_LISTING],
        gcTime: 0,
    })

    const markSoldMutation = useMutation({
        mutationFn: async (data: { listingId: string, value: boolean }) => {
            return await toggleItemSold(data.listingId, data.value)
        },
        onError: () => Swal.fire(createParamsForInfoToast('error', 'Error', 'Error occured')),
        onSuccess: (data: AxiosResponse<any, any> | undefined) => {
            const { value } = (JSON.parse(data?.config.data))
            setIsSold(value)
            Swal.fire({
                title: 'Success',
                text: `We have marked your product as ${value ? 'sold' : 'available'}`,
                icon: 'success',
                confirmButtonText: 'Okay'
            })
        },
        onSettled: () => { }
    })

    const updateMutation = useMutation({
        mutationFn: async (data: { formData: FormData, listingId: string }) => {
            return await updateListing(data.formData, data.listingId)
        },
        onError: () => Swal.fire(createParamsForInfoToast('error', 'Error', 'Getting error while updating this listing')),
        onSuccess: (data: AxiosResponse<any, any> | undefined) => {
            Swal.fire({
                title: 'Success',
                text: 'You item has been updated',
                icon: 'success',
                confirmButtonText: 'Okay'
            })
        },
        onSettled: () => { }
    })

    const deleteMutation = useMutation({
        mutationFn: async (data: { _id: string, images: (string | File | null)[] | undefined }) => {
            return await deleteListing(data)
        },
        onError: () =>  Swal.fire(createParamsForInfoToast('error', 'Error', 'Getting error while updating this listing')),
        onSuccess: (data: AxiosResponse<any, any> | undefined) => {
            Swal.fire({
                title: 'Success',
                text: 'Your listing has been deleted',
                icon: 'success',
                confirmButtonText: 'Okay'
            })
            router.push('/dashboard')
        },
        onSettled: () => { }
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
        userFormData.ownerid = loggedInUser?._id;
        userFormData.societyid = loggedInUser?.societyId;
        const formData = new FormData();
        for (let key in userFormData) {
            switch (key) {
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
        listing?._id && updateMutation.mutate({ formData, listingId: listing._id })

    }

    const toggleWithSold = (value: boolean) => {
        Swal.fire(createParamsForInfoToast('info', 'Info', value ? 'Marking as sold' : 'Marking as unsold'))
        listing?._id && markSoldMutation.mutate({ listingId: listing._id, value })
    }

    const deleteHandler = async () => {
        listing?._id && deleteMutation.mutate({ _id: listing?._id, images: listing?.images })
    }

    React.useEffect(() => {
        if (isError) {
            Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while getting listings from server'))
        }
        if (isSuccess) {
            setIsSold((listing).isSold || false)
        }
    }, []);

    return (<>
        <LoadingBackDrop isLoading={isLoading} />
        {!isLoading && listing && <>
            <Container component="main">
                <Formik initialValues={initialValues} onSubmit={updateListingHandler} enableReinitialize={true} validationSchema={BuySellValidationSchema}>
                    {({ values, setFieldValue, errors, resetForm, submitForm, setFieldError, setErrors }) => {
                        return (<>
                            <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant='h3' sx={{ fontWeight: 'bold' }}>

                                            <Button><NextLink href={{ pathname: `/dashboard/` }}><ReplyIcon fontSize='large' />&nbsp; Back</NextLink></Button>
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Switch
                                            checked={isSold}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                resetForm();
                                                toggleWithSold(event.target.checked)
                                            }}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                        <Typography sx={{ display: 'inline' }}><strong>Mark as sold</strong></Typography>
                                    </Box>
                                </Box>



                            </Grid>
                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                                <ImageBlock files={values.images} setFieldValue={setFieldValue} errors={errors} setFieldError={setFieldError} imageIndex={0} disabled={isSold} />
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
    </>
    )


})

interface IImageBlock {
    files: Array<File | null | string>,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<IBuySell>>,
    errors: FormikErrors<IBuySell>,
    setFieldError: (field: string, message: string | undefined) => void,
    imageIndex: number,
    disabled: boolean
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
        if (typeof file === 'string') {
            return `${BACKEND_URL}${file?.slice(1)}`
        } return URL.createObjectURL(file as File)
    }

    return <>
        {files.map((file, index) => <Grid item xs={2} sm={3} md={3}>
            <Box sx={{ backgroundColor: App.DarkBlue, color: 'white', height: 150, border: '0.5px solid gray', borderRadius: 2 }} onClick={() => {
                refs.get(index).current?.click();
            }}>
                {file ?
                    <>
                        <Fab color="error" aria-label="edit" size="small" sx={{ float: 'right', top: '-10px', right: '-10px' }} onClick={(e) => { !disabled && onRemoveImageHandler(e, index) }}>{disabled ? <LockIcon /> : <CloseIcon />}</Fab>
                        <img style={{ marginTop: '-39px', width: '-webkit-fill-available', height: '150px' }} src={getImageURL(file)} />
                    </>
                    :
                    <Typography sx={{ mt: 7 }} textAlign='center'>Click to select</Typography>
                }
                {!disabled && <VisuallyHiddenInput type="file" onChange={(e) => {
                    const FILE_SIZE = 2000000; // 2000000 BYTES = 2MB      
                    const SUPPORTED_IMG_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']

                    if (e.target.files && ((e.target.files[0] as File)?.size) > FILE_SIZE) {
                        Swal.fire(createParamsForInfoToast('info', 'File Size Exceeded', 'Only 2 MB file size is allowed', 15000))
                        return;
                    }
                    if (e.target.files && !SUPPORTED_IMG_FORMATS.includes((e.target.files[0] as File)?.type)) {
                        Swal.fire(createParamsForInfoToast('info', 'File Type Mismatch', 'Only image items are allowed', 15000))
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