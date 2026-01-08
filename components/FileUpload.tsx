import React, { useCallback } from 'react';
import { Upload, FileText, X, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { FileWithPreview } from '../types';

interface FileUploadProps {
  files: FileWithPreview[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
}

const FileUpload: React.FC<FileUploadProps> = ({ files, setFiles }) => {
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files) as File[];
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files) as File[];
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => 
      file.type === 'application/pdf' || 
      file.type.startsWith('image/') ||
      file.type === 'text/csv' || 
      file.name.endsWith('.csv') ||
      file.type === 'text/plain'
    );
    
    // Create preview URLs for images
    const filesWithPreviews = validFiles.map(file => {
      const preview = file.type.startsWith('image/') 
        ? URL.createObjectURL(file) 
        : undefined;
      return Object.assign(file, { preview });
    });

    setFiles(prev => [...prev, ...filesWithPreviews]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/') && (file as FileWithPreview).preview) {
      return <img src={(file as FileWithPreview).preview} alt="preview" className="w-full h-full object-cover" />;
    }
    if (file.name.endsWith('.csv') || file.type === 'text/csv') {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
      >
        <div className="bg-indigo-100 p-4 rounded-full mb-4 group-hover:bg-indigo-200 transition-colors">
          <Upload className="w-8 h-8 text-indigo-600" />
        </div>
        <p className="text-slate-700 font-medium text-lg mb-2">
          Drag & drop your bank statements here
        </p>
        <p className="text-slate-400 text-sm mb-6">
          Supports PDF, CSV, Images, Text
        </p>
        <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium cursor-pointer transition-colors shadow-sm">
          Browse Files
          <input
            type="file"
            multiple
            accept=".pdf,.csv,.txt,image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-sm"
              >
                <X className="w-3 h-3" />
              </button>
              
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-500 overflow-hidden">
                {getFileIcon(file)}
              </div>
              
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && files.length < 3 && (
        <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Please upload at least 3 statements for accurate analysis. ({files.length}/3)</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;