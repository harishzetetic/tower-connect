import { SocietyValidationSchema } from '@/Types';
import * as Yup from 'yup';
const FILE_SIZE = 5242880; //5MB
const SUPPORTED_FORMATS = ['application/pdf', 'image/jpg', 'image/jpeg', 'image/png']
export const OwnerSignupValidationSchema = Yup.object({
    society: SocietyValidationSchema,
    firstName: Yup.string().min(2).max(20).required("First name is mandatory"),
    lastName: Yup.string().min(2).max(20).required("Last name is mandatory"),
    towerNumber: Yup.string().matches(/^[a-zA-Z0-9]*$/, { message: 'Only alpha/numeric characters are allowed'}).required('Tower Number is required'),
    flatNumber:  Yup.string().matches(/^[0-9]*$/, { message: 'Only numeric characters are allowed'}).required('Flat Number is required'),
    flatType:  Yup.string().required('Flat Type is required'),
    email: Yup.string().email().required('Email is required'),
    phone: Yup.string().max(10).required('Phone Number is required'),
    dob:  Yup.string().required('DOB is required'),
    // imageUrl:  Yup.string().required('Uploading a proof image is mandatory'),
    proofDocument: Yup.mixed()
    .test('fileSize', "File Size is too large. Max upto 5MB is allowed", value => (value as File).size <= FILE_SIZE) 
    .test('fileType', "Unsupported File Format", value => SUPPORTED_FORMATS.includes((value as File).type))
    .required('Proof document is required which shows you are the actual owner of this property'),
    password:Yup.string().min(6).required("Password id required"),
    confirmPassword: Yup.string().required().oneOf([Yup.ref("password")], "Password not matched")

})