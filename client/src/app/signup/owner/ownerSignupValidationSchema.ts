import * as Yup from 'yup';
const FILE_SIZE = 5242880; //5MB
const SUPPORTED_FORMATS = ['application/pdf', 'image/jpg', 'image/jpeg', 'image/png']
export const OwnerSignupValidationSchema = Yup.object({
    society:Yup.object().shape({
        builderName:Yup.string().required(),
        societyName:Yup.string().required(),
        country:Yup.string().required(),
        state:Yup.string().required(),
        city:Yup.string().required(),
        pin:Yup.number().required(),
        addressline2:Yup.string().required(),
        addressline1:Yup.string().required(),
        _id:Yup.string().required(),
    }).required("Select any society"),
    firstName: Yup.string().min(2).max(20).required("First name is mandatory"),
    lastName: Yup.string().min(2).max(20).required("Last name is mandatory"),
    towerNumber: Yup.string().required('Tower Number is required'),
    flatNumber:  Yup.string().required('Flat Number is required'),
    flatType:  Yup.string().required('Flat Type is required'),
    email: Yup.string().required('Email is required'),
    phone: Yup.string().required('Phone Number is required'),
    dob:  Yup.string().required('DOB is required'),
    // imageUrl:  Yup.string().required('Uploading a proof image is mandatory'),
    proofDocument: Yup.mixed()
    .test('fileSize', "File Size is too large. Max upto 5MB is allowed", value => (value as File).size <= FILE_SIZE) 
    .test('fileType', "Unsupported File Format", value => SUPPORTED_FORMATS.includes((value as File).type))
    .required('Proof document is required which shows you are the actual owner of this property'),
    password:Yup.string().min(6).required("Password id required"),
    confirmPassword: Yup.string().required().oneOf([Yup.ref("password")], "Password not matched")

})