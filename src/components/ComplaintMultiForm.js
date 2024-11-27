import React, { useState } from 'react';
import {
  Fade, Box, CircularProgress, Stepper, Step, StepLabel, Button,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ComplaintOverview from './ComplaintOverview';
import IncidentDetails from './IncidentDetails';
import ComplainantInformation from './ComplainantInformation';
import SuspectInformation from './SuspectInformation';
import Evidence from './Evidence';
import ReviewAndSubmit from './ReviewAndSubmit';
import AdditionalDetails from './AdditionalDetails';
import { decryptToken } from "../authUtils";

const steps = [
  'Complaint Overview',
  'Incident Details',
  'Complainant Information',
  'Suspect Information',
  'Additional Details',
  'Evidence Upload',
  'Review and Submit',
];

const ComplaintMultiForm = () => {
  const navigate = useNavigate();
  const [isStepValid, setStepValid] = useState(false);
 
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    categoryid: 24,
    userid: '78f1d3f0-90c1-7093-9f1f-98ce774f64e8',
    policeid: '08f19300-c001-7067-3327-d85a96116731',
    reasonforwithdrawal: null,
    iswithdrawalaccepted: 0,
    iswithdrawn: 0,
    iscomplaintaccepted: 1,
    casestatus: 'Complaint Registered',
    isfirfiled: 0,
    individualdetails: {
      evidenceFiles: [],
    },
    aadhaarUpload: null,
  });
  const [loading, setLoading] = useState(false);

  //const token = "eyJraWQiOiJPMGgyenNCR2lacnlSTzBkNklqdDI1SzdteldpREJKejdhK0lBV2R6XC9yVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI3OGYxZDNmMC05MGMxLTcwOTMtOWYxZi05OGNlNzc0ZjY0ZTgiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYmlydGhkYXRlIjoiMjAwMi0xMC0yMCIsImdlbmRlciI6Im1hbGUiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9RUHVKZk9hRmMiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOmZhbHNlLCJjb2duaXRvOnVzZXJuYW1lIjoiNzhmMWQzZjAtOTBjMS03MDkzLTlmMWYtOThjZTc3NGY2NGU4Iiwib3JpZ2luX2p0aSI6IjI1NWRmZmY3LTU2NGQtNDliMy05ZGQ0LWRkZmE5MDAxM2JlZCIsImF1ZCI6IjJtbnYxN3ZvYTdlOHE2YmFubGcwajBxdGgiLCJldmVudF9pZCI6ImY4Mjc2N2QwLTZmNzctNDIwNC1hNjk3LTI4YTI5MjdiNTQ5MiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzMyMzY0NjIyLCJuYW1lIjoiU2hpdmEgUmFtYWtyaXNobmFuIiwicGhvbmVfbnVtYmVyIjoiKzkxODgyNTc5MjI2NSIsImV4cCI6MTczMjQ1MTAyMiwiY3VzdG9tOnJvbGUiOiJ1c2VyIiwiaWF0IjoxNzMyMzY0NjIyLCJqdGkiOiI0ZjdmYmVjNC1hNzViLTRkNWYtOTM3Ny01YzBlY2Q1NDBlNjQiLCJlbWFpbCI6InNoaXZhcmFtYWtyc2hubkBnbWFpbC5jb20ifQ.w460grcF-RPa02LJiiap6YkYnDNeTuQa4fuTBAYMLSHd97NGx2Di1OnfLakI6GxaD7tF0eLJgtKp2_-5kXmy86zYzD8eZqLGiRaCeSbmT-BsHGep4y_hSWHTuHVeJ9SgFxu9lLN5OXF1N608Z3G2vGOH8CuSZtAe0OgAxC9jyb3n9zvgNA8lHUf7jSST7Qo4rfgk_XiaPTTlmcL2U8DicaI-pARd6G0sNmNBJmofOF_dTVQGrCf_oN7kWRnajds6Xgcd7uo8F_FdLh2Z9XZWcRU3SaGqD67vuySmiNkJ0aHkKOlZcnf3Qxxty8EtmfANKrFel6_XizQ_O52k6FJV2A";

  const updateFormData = (input) => {
    setFormData((prev) => ({
      ...prev,
      individualdetails: {
        ...prev.individualdetails,
        ...input,
      },
    }));
  };

  const handleFileChange = (file, isAadhaar) => {
    if (isAadhaar) {
      setFormData((prev) => ({ ...prev, aadhaarUpload: file }));
    } else {
      setFormData((prev) => ({
        ...prev,
        individualdetails: {
          ...prev.individualdetails,
          evidenceFiles: [...prev.individualdetails.evidenceFiles, file],
        },
      }));
    }
  };

  const getPreSignedUrl = async (file, folderName, fileName) => {
    try {
      const response = await axios.post(
        'https://kz6gmd08a6.execute-api.ap-northeast-2.amazonaws.com/dev/uploadvideo',
        {
          body: {
            folderName,
            fileName,
            fileType: file.type,
          },
        }
      );

      console.log("Full API Response:", response);
      const responseBody = JSON.parse(response.data.body);
      console.log("Parsed Response Body:", responseBody);

      const url = responseBody.url;  // Adjust this if the API structure is different
      console.log(`Pre-signed URL: ${url}`);
      return url;
    } catch (error) {
      console.error('Error getting pre-signed URL:', error);
      return null;
    }
  };

  const uploadFileToS3 = async (file, preSignedUrl) => {
    try {
      await axios.put(preSignedUrl, file, {
        headers: { 'Content-Type': file.type },
      });
      console.log(`File ${file.name} uploaded successfully.`);
    } catch (error) {
      console.error(`Error uploading file ${file.name} to S3:`, error);
    }
  };

  const handleFileUploads = async (complaintId) => {
    const folderName = `${complaintId}`;
    try {
      // Upload Aadhaar file if present
      if (formData.aadhaarUpload) {
        const aadhaarUrl = await getPreSignedUrl(formData.aadhaarUpload, folderName, 'aadhaar');
        if (aadhaarUrl) {
          await uploadFileToS3(formData.aadhaarUpload, aadhaarUrl);
        }
      }

      // Upload evidence files if present
      for (let i = 0; i < formData.individualdetails.evidenceFiles.length; i++) {
        const file = formData.individualdetails.evidenceFiles[i];
        const evidenceUrl = await getPreSignedUrl(file, folderName, `evidence_${i + 1}`);
        if (evidenceUrl) {
          await uploadFileToS3(file, evidenceUrl);
        }
      }

      console.log('All files uploaded successfully to S3.');
    } catch (error) {
      console.error('Error during file uploads:', error);
    }
  };



  const handleSubmit = async () => {
    setLoading(true);
    try {
      const jwtToken = sessionStorage.getItem('jwt');  
      const token = decryptToken(jwtToken);
      const apiUrl = 'https://x4xn6amqo2.execute-api.eu-west-2.amazonaws.com/UserComplaints';
      const payload = {
        ...formData,
        individualdetails: JSON.stringify(formData.individualdetails),
      };

      const response = await axios.post(apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const responseBody = JSON.parse(response.data.body);
      const complaintId = responseBody.data?.complaintid;

      if (!complaintId) throw new Error('Complaint ID not returned from the server.');

      await handleFileUploads(complaintId);

      toast.success('Complaint submitted and files uploaded successfully!');

      await sendEmail(false);

      navigate('/user-cases');
    } catch (error) {
      console.error('Error during complaint submission:', error);
      toast.error('There was an error submitting the complaint.');
    } finally {
      setLoading(false);
    }
  };
  

  const sendEmail = async (withPdf) => {
    //const hardcodedEmail = "shivaramakrshnn@gmail.com"; // Replace with your hardcoded email address
  
    const emailApiUrl = withPdf
      ? 'https://8wy1xykpmk.execute-api.us-east-2.amazonaws.com/dev/withPdf'
      : 'https://8wy1xykpmk.execute-api.us-east-2.amazonaws.com/dev/withoutPdf';
  
    const payload = {
      recipient_email: formData.individualdetails.emailAddress,
      subject: 'Complaint Registration Confirmation',
      message_body: `Hello, your complaint has been successfully registered.`,
    };
  
    console.log("Preparing to send email...");
    console.log("API URL:", emailApiUrl);
    console.log("Payload:", payload);
  
    try {
      const jwtToken = sessionStorage.getItem('jwt');  
      const token = decryptToken(jwtToken);
      const response = await axios.post(emailApiUrl, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Email sent successfully:', response.data); // Logs response data on success
    } catch (error) {
      console.error('Error sending email:', error.response ? error.response.data : error.message);
    }
    const whatsappPayload = {
      "to": `+91${formData.individualdetails.phonenumber}`,
      "message": "You have successfully filed a case on the Drug Division portal of DiGiPo."
    }
    const jwtToken = sessionStorage.getItem('jwt');  
    const token = decryptToken(jwtToken);
    const apiResponse = await axios.post(
      process.env.REACT_APP_WHATSAPP_URL,
      whatsappPayload,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
         },
      }
    );

    console.log(apiResponse);
    try{
      const snsPayload = {
        "phone_number": `+91${formData.phone_number}`,
        "message": "You have successfully filed a case on the Drug Division portal of DiGiPo."
      }

      const snsApiResponse = await axios.post(
        process.env.REACT_APP_SNS_URL,
        snsPayload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
           },
        }
      );

      console.log(snsApiResponse);

    }
    catch (error) {
      console.error("Error sending SMS", error);
  }
  };

  
  

  const renderStep = (step) => {
    switch (step) {
      case 0:
        return <ComplaintOverview {...{ formData, updateFormData, setStepValid }} />;
      case 1:
        return <IncidentDetails {...{ formData, updateFormData, setStepValid }} />;
      case 2:
        return <ComplainantInformation {...{ formData, updateFormData, setStepValid }} />;
      case 3:
        return <SuspectInformation {...{ formData, updateFormData, setStepValid }} />;
      case 4:
        return <AdditionalDetails {...{ formData, updateFormData, setStepValid }} />;
      case 5:
        return <Evidence {...{ updateFormData ,setStepValid }} />;
      case 6:
        return <ReviewAndSubmit {...{ formData, setStepValid }} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: '700px', mx: 'auto', my: 4 }}>
      <Stepper activeStep={currentStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ my: 4 }}>
        {loading ? (
          <Fade in={loading}>
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          </Fade>
        ) : (
          renderStep(currentStep)
        )}
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((prev) => prev - 1)}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            if (currentStep === steps.length - 1) {
              handleSubmit();
            } else {
              setCurrentStep((prev) => prev + 1);
            }
          }}
          disabled={!isStepValid}
        >
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default ComplaintMultiForm;
