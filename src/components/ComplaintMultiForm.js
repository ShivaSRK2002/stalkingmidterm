import React, { useState } from 'react';
import {
  Fade, Box, CircularProgress, Stepper, Step, StepLabel, Button,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import ComplaintOverview from './ComplaintOverview';
import IncidentDetails from './IncidentDetails';
import ComplainantInformation from './ComplainantInformation';
import SuspectInformation from './SuspectInformation';
import Evidence from './Evidence';
import ReviewAndSubmit from './ReviewAndSubmit';
import AdditionalDetails from './AdditionalDetails';

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
    userid: 'user007',
    policeid: 'user182',
    reasonforwithdrawal: null,
    iswithdrawalaccepted: 0,
    iswithdrawn: 0,
    iscomplaintaccepted: 1,
    casestatus: 'under investigation',
    isfirfiled: 1,
    individualdetails: {
      evidenceFiles: [],
    },
    aadhaarUpload: null,
  });
  const [loading, setLoading] = useState(false);

  const token = 'eyJraWQiOiJPMGgyenNCR2lacnlSTzBkNklqdDI1SzdteldpREJKejdhK0lBV2R6XC9yVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJlODMxZjMyMC0zMDQxLTcwYzctYjcxYS0zZGUzNjc1ZDVkNmMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYmlydGhkYXRlIjoiMjBcLzEwXC8yMDAyIiwiZ2VuZGVyIjoiTWFsZSIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX1FQdUpmT2FGYyIsInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsImNvZ25pdG86dXNlcm5hbWUiOiJlODMxZjMyMC0zMDQxLTcwYzctYjcxYS0zZGUzNjc1ZDVkNmMiLCJvcmlnaW5fanRpIjoiNDkyODQ1MTUtNjQ4ZC00N2EzLTljYTItZTM5NzZhYzZhMWNmIiwiYXVkIjoiMm1udjE3dm9hN2U4cTZiYW5sZzBqMHF0aCIsImV2ZW50X2lkIjoiYWQzYWRmOGItNjA4Mi00NGI4LTlmMWMtNGUxZDU0NjFkZTM5IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MzIwNzc5MzIsIm5hbWUiOiJTaGl2YSIsInBob25lX251bWJlciI6Iis5MTg4MjU3OTIyNjUiLCJleHAiOjE3MzIxNjQzMzIsImN1c3RvbTpyb2xlIjoidXNlciIsImlhdCI6MTczMjA3NzkzMiwianRpIjoiMmY4MDYzY2QtOTM2Yi00MjA1LTg3OTctY2JhZGJhZGZlZDc2IiwiZW1haWwiOiJzaGl2YXJhbWFrcnNobm5AZ21haWwuY29tIn0.BFXiE_aUW2_u1slt8gTjs9THcDTGmbJ5kG0OTJaJ3Tqzchem2nhQRySfPGqbw0Cc0KJ1ycAkG1zsv2COfaMjMC1T4Uw85OaG0c7urYWOtnk2e2QQ5S4LZ87BRd9jlf5FlDMJFxznnPTnGH5OTlDSUAozINJkEEO1sHcPlrRwTpeG6nhif_AsC1bCyeONy-HCdCjR8g17vT7kGBjsb1lKezEMpKx6rY4x14eEOaBf_YVG10ylB6yTFeCXvkCGrABDyVHdZ9Cvr6qA0jTcmjEL6yLM5uoSqiuaJddIYylsGFnK2W7bpI7AUn3tKp3HUsE5xGW3Ir3UQNsXo3h4VQ87Cw'; // Replace with your token

  const updateFormData = (input) => {
    setFormData((prev) => ({
      ...prev,
      individualdetails: { ...prev.individualdetails, ...input },
    }));
  };

  const handleFileChange = (file, isAadhaar) => {
    setFormData((prev) => ({
      ...prev,
      [isAadhaar ? 'aadhaarUpload' : 'individualdetails']: isAadhaar
        ? file
        : { ...prev.individualdetails, evidenceFiles: [...prev.individualdetails.evidenceFiles, file] },
    }));
  };

  const getPreSignedUrl = async (file, folderName, fileName) => {
    try {
      const response = await axios.post(
        'https://kz6gmd08a6.execute-api.ap-northeast-2.amazonaws.com/dev/uploadvideo',
        { body: { folderName, fileName, fileType: file.type } },
      );
      return JSON.parse(response.data.body)?.url;
    } catch (error) {
      console.error('Error getting pre-signed URL:', error);
      return null;
    }
  };

  const uploadFileToS3 = async (file, preSignedUrl) => {
    try {
      await axios.put(preSignedUrl, file, { headers: { 'Content-Type': file.type } });
    } catch (error) {
      console.error(`Error uploading file ${file.name} to S3:`, error);
    }
  };

  const handleFileUploads = async (complaintId) => {
    const folderName = `${complaintId}`;
    try {
      if (formData.aadhaarUpload) {
        const aadhaarUrl = await getPreSignedUrl(formData.aadhaarUpload, folderName, 'aadhaar');
        if (aadhaarUrl) await uploadFileToS3(formData.aadhaarUpload, aadhaarUrl);
      }

      for (let i = 0; i < formData.individualdetails.evidenceFiles.length; i++) {
        const file = formData.individualdetails.evidenceFiles[i];
        const evidenceUrl = await getPreSignedUrl(file, folderName, `evidence_${i + 1}`);
        if (evidenceUrl) await uploadFileToS3(file, evidenceUrl);
      }
    } catch (error) {
      console.error('Error during file uploads:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
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

      alert('Complaint submitted and files uploaded successfully!');
      navigate('/user-cases');
    } catch (error) {
      console.error('Error during complaint submission:', error);
      alert('There was an error submitting the complaint.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    const stepComponents = [
      <ComplaintOverview setStepValid={setStepValid} />,
      <IncidentDetails setStepValid={setStepValid} />,
      <ComplainantInformation setStepValid={setStepValid} />,
      <SuspectInformation setStepValid={setStepValid} />,
      <AdditionalDetails setStepValid={setStepValid} />,
      <Evidence setStepValid={setStepValid} />,
      <ReviewAndSubmit setStepValid={setStepValid} />,
    ];
    const CurrentComponent = stepComponents[currentStep];
    return React.cloneElement(CurrentComponent, {
      nextStep: () => setCurrentStep((prev) => prev + 1),
      prevStep: () => setCurrentStep((prev) => prev - 1),
      handleSubmit,
      updateFormData,
      setStepValid,
      handleFileChange,
      formData,
    });
  };
  return (
    <Box sx={{ position: 'relative', padding: 3 }}>
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStep()}

      {loading && (
        <Fade in={loading}>
          <CircularProgress
            size={50}
            sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />
        </Fade>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        <Button disabled={currentStep === 0} onClick={() => setCurrentStep((prev) => prev - 1)}>
          Back
        </Button>
        <Button onClick={currentStep === steps.length - 1 ? handleSubmit : () => setCurrentStep((prev) => prev + 1)}>
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default ComplaintMultiForm;
