import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

export default function UploadZone({ onFileSelect }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    multiple: false,
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`rounded-2xl border-2 border-dashed p-16 text-center cursor-pointer transition
      ${
        isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-slate-300 hover:border-blue-400"
      }`}
    >
      <input {...getInputProps()} />

      <UploadCloud className="mx-auto mb-4" size={50} />

      <h2 className="text-2xl font-semibold">
        Drag & Drop your CSV
      </h2>

      <p className="mt-2 text-slate-500">
        or click to browse
      </p>
    </div>
  );
}