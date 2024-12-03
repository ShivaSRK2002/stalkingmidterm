import jsPDF from 'jspdf';

// Function to fetch image and convert it to base64
const fetchImageAsBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1]; // Get the base64 part
            resolve(`data:image/png;base64,${base64String}`);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const generateFIRCopy = async (caseItem) => {
    // Create a new PDF document
    const doc = new jsPDF();

    // Set up a border around the page
    doc.setLineWidth(1);
    doc.rect(5, 5, 200, 287); // Border around the document

    // Set up the background color and header
    doc.setFillColor(0, 51, 102); // DiGiPo Portal Color
    doc.rect(0, 0, 210, 40, 'F'); // Header Rectangle

    // Add DiGiPo Portal Header
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255); // White Text
    doc.text('DiGiPo Stalking Case Copy', 105, 25, { align: 'center' });

    // Insert DiGiPo Logo
    const imageUrl = 'https://i.ibb.co/qR43n8z/logodigipoloader.png';
    const base64Image = await fetchImageAsBase64(imageUrl);
    doc.addImage(base64Image, 'PNG', 10, 5, 30, 30); // Optionally add logo

    // Title and Case Information
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Stalking Case Report', 105, 50, { align: 'center' });

    // Case ID and Date of Report
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black text for normal case info
    
    doc.text(`Case ID: ${caseItem?.caseId || 'Not Provided'}`, 20, 65);
    doc.text(`Date of Report: ${new Date().toLocaleDateString()}`, 20, 70);

    // Incident Details Section
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102); // Section Title Color
    doc.text('Incident Details:', 20, 90);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0); // Normal Text Color
    doc.text(`Incident Date: ${caseItem.individualdetails?.incident_date || 'Not Provided'}`, 20, 95);
    doc.text(`Incident Time: ${caseItem.individualdetails?.incidentTime || 'Not Provided'}`, 20, 100);
    doc.text(`Incident Location: ${caseItem.individualdetails?.Location || 'Not Provided'}`, 20, 105);
    doc.text(`Nature of Stalking: ${caseItem.individualdetails?.natureOfStalking || 'Not Provided'}`, 20, 110);
    doc.text(`Description: ${caseItem.individualdetails?.incident_description || 'Not Provided'}`, 20, 115);

    // Personal Information Section
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102); // Section Title Color
    doc.text('Personal Information:', 20, 130);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0); // Normal Text Color
    doc.text(`Full Name: ${caseItem.individualdetails?.complainantName || 'Not Provided'}`, 20, 135);
    doc.text(`Email Address: ${caseItem.individualdetails?.victim_email || 'Not Provided'}`, 20, 140);
    doc.text(`Phone Number: ${caseItem.individualdetails?.phoneNumber || 'Not Provided'}`, 20, 145);
    doc.text(`Address: ${caseItem.individualdetails?.address || 'Not Provided'}`, 20, 150);
    doc.text(`Gender: ${caseItem.individualdetails?.gender || 'Not Provided'}`, 20, 155);

    // Investigation Status Section
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Investigation Details:', 20, 170);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Investigation Status: ${caseItem.casestatus || 'Complaint Registred'}`, 20, 180);

    // Case Status Section
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Case Status:', 20, 200);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`FIR Filed: ${caseItem.isfirfiled ? 'Yes' : 'No'}`, 20, 205);
    doc.text(`Case Status: ${caseItem.casestatus || 'Pending'}`, 20, 210);

    //Important note about the human trafficking case
    doc.setFontSize(12);
    doc.setTextColor(255, 0, 0); // Red Text for special notes
    doc.text('Important Note: This is a Stalking case. Ongoing investigation is in progress to rescue the victim and apprehend the suspects.', 20, 230, { maxWidth: 180 });
 
    // Seal - Add a circular seal at the bottom left with "DiGiPo" spelled in it
    doc.setFillColor(255, 0, 0); // Blue color for the seal (matching DiGiPo theme)
    doc.circle(23, 265, 15, 'F'); // Draw filled circle for the seal
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255); // White text for the seal
    doc.text('FIR FILED', 22.5, 265, { align: 'center' }); // Ensure the text fits well within the seal
 
    // Digital Signature placeholder at the bottom right
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black text for signature
    doc.text('Digital Signature:', 150, 270);
    doc.setFont('Courier', 'normal');
    doc.setFontSize(10);
    doc.text('This is an auto-generated document.', 115, 275);
    doc.text('It is valid without a physical signature.', 115, 280);
 
    // Footer Section
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text('This document was generated by DiGiPo Portal. All rights reserved.', 105, 290, { align: 'center' });
 
    // Save the document as a PDF
    doc.save(`FIR_Case_${caseItem.caseId}.pdf`);
};

