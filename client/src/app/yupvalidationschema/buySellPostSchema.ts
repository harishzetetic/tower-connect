import * as Yup from 'yup';
import _ from 'lodash';

export const BuySellValidationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    price: Yup.string().required("Price is requried"),
    category: Yup.string().required('Category is required'),
    condition:  Yup.string().required('Condition is required'),
    description:  Yup.string().required('Product description is required'),
    images: Yup.mixed().test('fileSize', "At lest one image should be selected", (value)=>{
        const removeNullable = (value as Array<File | null>).filter(n => n)
        if(removeNullable.length){
            return true;
        }
        return false;
        
    }),
})

//.test('fileSize', "File Size is too large. Max upto 2 MB is allowed", checkSize)
//.test('fileType', "Unsupported File Format", checkFormat)