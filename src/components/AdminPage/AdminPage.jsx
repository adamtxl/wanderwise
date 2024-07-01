import React, {useState} from 'react';
import axios from 'axios';
import FileUpload from '../FileUpload/FileUpload';


function AdminPage() {

    const [files, setFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
  
    function handleMultipleChange(event) {
      setFiles([...event.target.files]);
    }
  
    function handleMultipleSubmit(event) {
      event.preventDefault();
      const url = 'http://localhost:5173/uploadFiles';
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
  
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
  
      axios.post(url, formData, config)
        .then((response) => {
          console.log(response.data);
          setUploadedFiles(response.data.files);
        })
        .catch((error) => {
          console.error("Error uploading files: ", error);
        });
    }

    return (
       <>
       <section>
        <h2> Upload CSV file to Add to existing Map locations </h2>
        <p className='shadow, visible'>Important to note: csv columns must be <strong>EXACTLY</strong> named: "name", "description", "latitude", "longitude".</p>
        <FileUpload />
       </section>
       </>
  );
}

  export default AdminPage;