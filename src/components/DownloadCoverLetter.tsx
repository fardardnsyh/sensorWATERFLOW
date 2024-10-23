import React from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

interface DownloadCoverLetterProps {
  coverLetter: string;
}

const DownloadCoverLetter: React.FC<DownloadCoverLetterProps> = ({ coverLetter }) => {
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

  const handleDownload = () => {
    const doc = createDocumentWithFormatting(coverLetter);

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "cover_letter.docx");
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 text-center">
      <h2 className="text-3xl font-bold mb-4">Your Cover Letter is Ready!</h2>
      <p className="mb-8">Click the button below to download your personalized cover letter.</p>
      <button 
        onClick={handleDownload}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
      >
        Download Cover Letter
      </button>
      <div className="mt-8 text-left">
        <h3 className="text-xl font-semibold mb-2">Preview:</h3>
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
          {coverLetter || 'No cover letter text available.'}
        </pre>
      </div>
    </div>
  );
};

export default DownloadCoverLetter;