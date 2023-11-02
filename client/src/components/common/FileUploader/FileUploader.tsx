import Dropzone from "react-dropzone-uploader"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Dispatch, SetStateAction } from "react";



interface IFileUploaderProps {
  setProofDocument: (file:File | null) => void;
}
const FileUploader = (props:IFileUploaderProps) => {
    const {setProofDocument} = props;
    const getUploadParams = () => {return { url: 'https://httpbin.org/post' }}
    const handleChangeStatus = (meta, status) => {
      if(status === 'done'){
        setProofDocument(meta.file)
      }
    }
  
     const handleSubmit = (files, allFiles) => {
       console.log(files.map(f => f.meta))
       allFiles.forEach(f => f.remove())
     }

    return <Dropzone
        // getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        // onSubmit={handleSubmit}
        styles={{ dropzone: { minHeight: 200, maxHeight: 250 } }}
        maxFiles={1}
        accept="image/*,.pdf"
        inputContent={<>
           
            Please upload any valid pdf or image document to verify your ownership
        </>}
        
  />
}

export default FileUploader