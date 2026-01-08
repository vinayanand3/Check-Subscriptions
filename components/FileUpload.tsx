import React, { useCallback } from 'react';
import { Upload, FileText, X, AlertCircle, FileSpreadsheet, Check } from 'lucide-react';
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
      return <FileSpreadsheet className="w-6 h-6 text-emerald-600" />;
    }
    return <FileText className="w-6 h-6 text-indigo-500" />;
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="relative border-3 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all cursor-pointer group animate-fade-in"
      >
        <div className="bg-white p-5 rounded-2xl mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300 ring-1 ring-slate-100">
          <Upload className="w-8 h-8 text-indigo-600" />
        </div>
        <p className="text-slate-800 font-bold text-xl mb-2">
          Drag & drop your bank statements
        </p>
        <p className="text-slate-400 text-base mb-8 text-center max-w-sm">
          Supports PDF, CSV, Images and Text files. We recommend uploading at least 3 months of history.
        </p>
        <label className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
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
        <div className="mt-8">
            <h4 className="text-sm font-bold text-slate-700 mb-4 px-1">Selected Files ({files.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
                <div key={index} className="relative bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
                <button
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-white text-slate-400 border border-slate-200 p-1.5 rounded-full hover:bg-red-50 hover:text-red-500 hover:border-red-200 shadow-sm transition-all opacity-0 group-hover:opacity-100"
                >
                    <X className="w-4 h-4" />
                </button>
                
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-100">
                    {getFileIcon(file)}
                </div>
                
                <div className="overflow-hidden flex-1">
                    <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {(file.size / 1024).toFixed(0)} KB
                        </span>
                        <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
      )}

      {files.length > 0 && files.length < 3 && (
        <div className="mt-6 flex items-center gap-3 text-amber-700 bg-amber-50 p-4 rounded-xl text-sm border border-amber-100">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Please upload at least 3 statements for accurate subscription analysis. ({files.length}/3)</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;