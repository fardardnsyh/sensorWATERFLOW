import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FileUp, FileText, Briefcase, Info } from 'lucide-react'; // Import icons

interface CVUploadFormProps {
  onSubmit: (coverLetter: string) => void;// Add this prop for the go back functionality
}

const CVUploadForm: React.FC<CVUploadFormProps> = ({ onSubmit }) => {
  const [cv, setCV] = useState<File | null>(null);
  const [previousCoverLetter, setPreviousCoverLetter] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    const file = event.target.files?.[0] || null;
    setter(file);
  };

  const createDocumentWithFormatting = (coverLetter: string) => {
    const paragraphs = coverLetter.split('\n\n').map(para => 
      new Paragraph({
        children: [new TextRun(para.trim())],
        spacing: { after: 200 },
        alignment: AlignmentType.JUSTIFIED,
        indent: { firstLine: 0 }, // Remove first-line indent
      })
    );

    return new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "Cover Letter",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          ...paragraphs
        ],
      }],
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (cv) formData.append('cv', cv);
      if (previousCoverLetter) formData.append('previousCoverLetter', previousCoverLetter);
      formData.append('jobDescription', jobDescription);
      formData.append('extraInfo', extraInfo);

      const response = await axios.post(`${API_URL}/generate-cover-letter`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Response data:', response.data);
      console.log('Cover letter length:', response.data.coverLetter?.length);

      if (response.data.coverLetter) {
        const doc = createDocumentWithFormatting(response.data.coverLetter);

        // Generate and save the document
        Packer.toBlob(doc).then(blob => {
          saveAs(blob, "cover_letter.docx");
          onSubmit(response.data.coverLetter);
        });
      } else {
        console.error('No cover letter data received');
        setError('No cover letter data received. Please try again.');
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
      }
      setError('An error occurred while generating your cover letter. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl flex items-center justify-center">
            <FileText className="mr-4 h-8 w-8" /> Generate Cover Letter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cv-upload" className="flex items-center text-lg">
                  <FileUp className="mr-2 h-5 w-5" /> Upload CV
                </Label>
                <Input
                  id="cv-upload"
                  type="file"
                  onChange={(e) => handleFileUpload(e, setCV)}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover-letter-upload" className="flex items-center text-lg">
                  <FileText className="mr-2 h-5 w-5" /> Upload Previous Cover Letter
                </Label>
                <Input
                  id="cover-letter-upload"
                  type="file"
                  onChange={(e) => handleFileUpload(e, setPreviousCoverLetter)}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-description" className="flex items-center text-lg">
                <Briefcase className="mr-2 h-5 w-5" /> Job Description
              </Label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="h-32"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="extra-info" className="flex items-center text-lg">
                <Info className="mr-2 h-5 w-5" /> Additional Information (Optional)
              </Label>
              <Textarea
                id="extra-info"
                value={extraInfo}
                onChange={(e) => setExtraInfo(e.target.value)}
                placeholder="Add extra information such as your address, contact details, etc."
                className="h-32"
              />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}
            <Button 
              type="submit" 
              className="w-full text-lg py-3"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Cover Letter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CVUploadForm;