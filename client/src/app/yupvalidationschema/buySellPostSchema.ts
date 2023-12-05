import * as Yup from 'yup';
const FILE_SIZE = 2000000; // 2000000 BYTES = 2MB      
const SUPPORTED_IMG_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']

const checkSize = (value: any)=>{
    if(!value){
        return true
    } else {
        return ((value as File)?.size) <= FILE_SIZE
    }
}
const checkFormat = (value: any)=>{
    if(!value){
        return true
    }else {
        return SUPPORTED_IMG_FORMATS.includes((value as File)?.type)
    }
}
export const BuySellValidationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    price: Yup.string().required("Price is requried"),
    category: Yup.string().required('Category is required'),
    condition:  Yup.string().required('Condition is required'),
    description:  Yup.string().required('Product description is required'),
    image1: Yup.mixed()
    .test('fileSize', "File Size is too large. Max upto 2 MB is allowed", checkSize)
    .test('fileType', "Unsupported File Format", checkFormat).nullable(),
    image2: Yup.mixed()
    .test('fileSize', "File Size is too large. Max upto 2 MB is allowed", checkSize) 
    .test('fileType', "Unsupported File Format", checkFormat).nullable(),
    image3: Yup.mixed()
    .test('fileSize', "File Size is too large. Max upto 2 MB is allowed", checkSize) 
    .test('fileType', "Unsupported File Format", checkFormat).nullable(),
    image4: Yup.mixed()
    .test('fileSize', "File Size is too large. Max upto 2 MB is allowed", checkSize) 
    .test('fileType', "Unsupported File Format", checkFormat).nullable(),
})