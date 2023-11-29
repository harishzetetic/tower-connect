import * as Yup from 'yup';
const FILE_SIZE = 5242880; //5MB
const SUPPORTED_IMG_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']
export const BuySellValidationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    price: Yup.string().required("Price is requried"),
    category: Yup.string().required('Category is required'),
    condition:  Yup.string().required('Condition is required'),
    description:  Yup.string().required('Product description is required'),
    image1: Yup.mixed()
    .test('fileSize', "File Size is too large. Max upto 5MB is allowed", value => (value as File).size <= FILE_SIZE) 
    .test('fileType', "Unsupported File Format", value => SUPPORTED_IMG_FORMATS.includes((value as File).type)),
    image2: Yup.mixed()
    .test('fileSize', "File Size is too large. Max upto 5MB is allowed", value => (value as File).size <= FILE_SIZE) 
    .test('fileType', "Unsupported File Format", value => SUPPORTED_IMG_FORMATS.includes((value as File).type)),
    image3: Yup.mixed()
    .test('fileSize', "File Size is too large. Max upto 5MB is allowed", value => (value as File).size <= FILE_SIZE) 
    .test('fileType', "Unsupported File Format", value => SUPPORTED_IMG_FORMATS.includes((value as File).type)),
    image4: Yup.mixed()
    .test('fileSize', "File Size is too large. Max upto 5MB is allowed", value => (value as File).size <= FILE_SIZE) 
    .test('fileType', "Unsupported File Format", value => SUPPORTED_IMG_FORMATS.includes((value as File).type)),
})