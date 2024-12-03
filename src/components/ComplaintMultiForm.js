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
const userid = sessionStorage.getItem("userName")
const ComplaintMultiForm = () => {
  const navigate = useNavigate();

  const [isStepValid, setStepValid] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    categoryid: 24,
    userid: userid,
    policeid: '08919330-1061-7023-b078-11e4656a747b',
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
  const updateFormData = (input) => {
    setFormData((prev) => ({
      ...prev,
      individualdetails: {
        ...prev.individualdetails,
        ...input,
        caseappliedtime: prev.individualdetails.caseappliedtime || new Date().toISOString(),
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
      delete payload.proofFile;
      delete payload.evidenceFiles;
      console.log("Parent formData updated:", formData);
    
  
      const response = await axios.post(apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
     
      const responseBody = JSON.parse(response.data.body);
      const complaintId = responseBody.data?.complaintid;
  
      if (!complaintId) {
        console.error('Complaint ID not returned from the server.');       
        return; // Exit gracefully if `complaintId` is not available
      }
      
  
      await handleFileUploads(complaintId); // Assuming handleFileUploads handles the files after complaint is created.
  
      toast.success('Complaint submitted and files uploaded successfully!');
      
      // Pass the complaintId to sendEmail
      await sendEmail(false, complaintId);  // Pass the complaintId here
      
      navigate('/user-cases');
    } catch (error) {
      console.error('Error during complaint submission:', error);
      toast.error('There was an error submitting the complaint.');
    } finally {
      setLoading(false);
    }
  };
  const sendEmail = async (withPdf, complaintId) => {
    const jwtToken = sessionStorage.getItem('jwt');
  const token = decryptToken(jwtToken);  // Decrypt the token here

    const emailApiUrl = withPdf
      ? 'https://8wy1xykpmk.execute-api.us-east-2.amazonaws.com/dev/withPdf'
      : 'https://8wy1xykpmk.execute-api.us-east-2.amazonaws.com/dev/withoutPdf';
  
    // Construct the payload for the email
    const payload = {
      recipient_email: formData.individualdetails.victim_email,
      subject: 'Confirmation of Your Stalking Complaint Registration',
      message_body: `Dear ${formData.individualdetails.complainantName},
  
  We are writing to confirm that your report regarding Stalking has been successfully recorded in our system. We deeply appreciate your decision to bring this serious matter to our attention, and we want to assure you that your case will be treated with the highest priority, confidentiality, and care.
  
  Complaint Details:
  Complaint ID: ${complaintId}
  Complaintant Name: ${formData.individualdetails.complainantName}
  Date of Incident: ${formData.individualdetails.incident_date}
  
  Our team will carefully review the information you provided and take the necessary actions. If we require any further details or documents, you will be promptly notified via this email address or the contact number you provided in your report.
  
  Important Safety Tips and Next Steps:
  
  - Do not engage directly with the alleged individual involved in the stalking. Direct interaction can escalate the situation further.
  - Document all encounters: Keep detailed records of any communication, threats, or encounters with the individual. If safe to do so, take screenshots, save messages, or record conversations.
  - Change passwords and enable two-factor authentication on any accounts that may have been compromised.
  - Report any further suspicious activity immediately to our department. We are here to support you through this process.
    
  If at any point you feel unsafe or threatened, please contact your local law enforcement authorities immediately.
  
  Should you have any questions or need further assistance, please do not hesitate to reach out to us at digipo@gmail.com. When contacting us, kindly include your Complaint Id for faster resolution.
  
  Thank you once again for reporting this matter and for your vigilance in helping us combat stalking and other cybercrimes. We are committed to ensuring your safety and taking appropriate action.
  
  Warm regards,
  DiGiPo Cyber Crime Division`,
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
      console.log('Email sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending email:', error.response ? error.response.data : error.message);
    }
  
    // Send WhatsApp message
    const whatsappPayload = {
      to: `+91${formData.individualdetails.phoneNumber}`,
      message: `Hello ${formData.individualdetails.complainantName},

We would like to confirm that your complaint (ID: ${complaintId}) has been successfully submitted to DiGiPo. Our team is currently reviewing your case and will take the necessary actions to address the matter promptly.

Your safety and privacy are of utmost importance to us, and we appreciate your cooperation in helping us maintain a secure online environment.

If you have any further questions or need assistance, feel free to reach out to us.

Thank you for trusting DiGiPo.

Best regards,
DiGiPo Cyber Crime Division`,
    };
    try {
      const apiResponse = await axios.post(process.env.REACT_APP_WHATSAPP_URL, whatsappPayload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      console.log('WhatsApp response:', apiResponse.data);
    } catch (error) {
      console.error('Error sending WhatsApp:', error.response ? error.response.data : error.message);
    }
  
    // Send SMS via SNS
    const snsPayload = {
      phone_number: `${formData.individualdetails.phoneNumber}`,
      message: "You have successfully filed a case on the Drug Division portal of DiGiPo.",
    };
    try {
      const snsApiResponse = await axios.post(process.env.REACT_APP_SNS_URL, snsPayload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      console.log('SNS response:', snsApiResponse.data);
    } catch (error) {
      console.error('Error sending SMS:', error.response ? error.response.data : error.message);
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
        return <Evidence {...{ updateFormData, setStepValid }} />;
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