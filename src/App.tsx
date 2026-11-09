import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { Upload, FileSpreadsheet, LoaderCircle } from "lucide-react";
import { jsonApiService } from "./services/jsonApiService";
import CsvDataTable from "./components/CsvDataTable";

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCSVUpload = async (selectedFile: File) => {
    setFile(selectedFile);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await jsonApiService.createResourceWithFile({
        resource: "upload-csv",
        data: formData,
      });

      console.log("CSV uploaded successfully:", response);

      // Refresh table after successful upload
      setRefreshKey((previous) => previous + 1);
    } catch (error) {
      console.error("CSV upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen space-y-6 bg-slate-50 p-6">
      {/* CSV Upload */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <FileUploader
          types={["CSV"]}
          handleChange={handleCSVUpload}
          name="csvFile"
          disabled={loading}
          hoverTitle="Drop here"
        >
          <div className="m-1 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 p-8 text-center transition hover:border-blue-500 hover:bg-blue-50">
            <div className="rounded-full bg-blue-50 p-3 text-blue-600">
              <FileSpreadsheet size={28} />
            </div>

            <p className="font-semibold text-slate-800">Upload CSV</p>

            <p className="text-sm text-slate-500">
              Drag and drop your CSV file here or browse
            </p>

            <p className="text-xs text-slate-400">Supported format: CSV</p>

            {file && (
              <p className="mt-2 text-sm font-medium text-green-600">
                Selected: {file.name}
              </p>
            )}

            {loading && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <LoaderCircle size={16} className="animate-spin" />
                Uploading...
              </div>
            )}

            {!loading && (
              <span className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                <Upload size={16} />
                Choose CSV File
              </span>
            )}
          </div>
        </FileUploader>
      </div>

      {/* CSV Data Table */}
      <CsvDataTable key={refreshKey} />
    </main>
  );
};

export default App;
