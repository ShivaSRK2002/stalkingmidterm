import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, IconButton, Divider } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import DeleteIcon from '@mui/icons-material/Delete';

const Evidence = ({ updateFormData, formData }) => {
  const [proofFile, setProofFile] = useState(null);
  const [evidenceFiles, setEvidenceFiles] = useState([]);

  // Handle proof file selection
  const handleProofFileChange = (e) => {
    const file = e.target.files[0];
    setProofFile(file);
    updateFormData({ proofFile: file });
  };

  // Handle proof file removal
  const removeProofFile = () => {
    setProofFile(null);
    updateFormData({ proofFile: null });
  };

  // Handle evidence file selection
  const handleEvidenceFileChange = (e) => {
    const files = Array.from(e.target.files);
    setEvidenceFiles(files);
    updateFormData({ evidenceFiles: files });
  };

  // Remove individual evidence file
  const removeEvidenceFile = (index) => {
    const updatedFiles = evidenceFiles.filter((_, i) => i !== index);
    setEvidenceFiles(updatedFiles);
    updateFormData({ evidenceFiles: updatedFiles });
  };

  return (
    <Box sx={{ padding: 4, maxWidth: '800px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        Evidence Upload
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ marginBottom: 3, color: 'gray', fontStyle: 'italic' }}
      >
        Upload supporting files for your complaint (e.g., images, videos, or documents)
      </Typography>

      <Grid container spacing={4}>
        {/* Proof Upload */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Proof
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              <Button
                variant="outlined"
                component="label"
                startIcon={<AttachFileIcon />}
                fullWidth
                sx={{ marginBottom: 2 }}
              >
                Choose File
                <input
                  hidden
                  accept="image/*,application/pdf"
                  type="file"
                  onChange={handleProofFileChange}
                />
              </Button>
              {proofFile ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 1,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <AttachFileIcon sx={{ marginRight: 1, color: '#1976d2' }} />
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {proofFile.name}
                  </Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={removeProofFile}
                    aria-label="Remove proof file"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: 'gray' }}>
                  No proof file selected.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Evidence Upload */}
        <Grid item xs={12}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Evidence (Images/Videos)
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              <Button
                variant="outlined"
                component="label"
                startIcon={<AttachFileIcon />}
                fullWidth
                sx={{ marginBottom: 2 }}
              >
                Choose Files
                <input
                  hidden
                  accept="image/*,video/*"
                  type="file"
                  multiple
                  onChange={handleEvidenceFileChange}
                />
              </Button>
              {evidenceFiles.length > 0 ? (
                <Box>
                  {evidenceFiles.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 1,
                        marginBottom: 1,
                        backgroundColor: '#f9f9f9',
                        borderRadius: 2,
                        boxShadow: 1,
                      }}
                    >
                      {file.type.startsWith('image') ? (
                        <ImageIcon sx={{ marginRight: 1, color: '#1976d2' }} />
                      ) : (
                        <VideoLibraryIcon sx={{ marginRight: 1, color: '#1976d2' }} />
                      )}
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        {file.name}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeEvidenceFile(index)}
                        aria-label="Remove evidence file"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: 'gray' }}>
                  No evidence files selected.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Evidence;
