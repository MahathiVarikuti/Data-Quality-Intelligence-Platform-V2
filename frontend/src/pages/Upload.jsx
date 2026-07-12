import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import UploadZone from "../components/upload/UploadZone";
import { uploadDataset } from "../api/dataset";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(selectedFile) {
    setFile(selectedFile);

    try {
      setUploading(true);

      await uploadDataset(selectedFile);

      alert("Dataset uploaded successfully!");

    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <DashboardLayout>
      <h1 className="mb-8 text-3xl font-bold">
        Upload Dataset
      </h1>

      <UploadZone onFileSelect={handleUpload} />

      {file && (
        <div className="mt-6 rounded-xl border bg-white p-6">
          <h3 className="font-semibold">
            Selected File
          </h3>

          <p className="mt-2">
            {file.name}
          </p>

          <p className="text-sm text-slate-500">
            {(file.size / 1024).toFixed(2)} KB
          </p>

          {uploading && (
            <p className="mt-4 text-blue-600">
              Uploading...
            </p>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}