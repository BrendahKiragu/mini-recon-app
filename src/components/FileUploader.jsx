import { useRef, useState } from "react";
import { Upload, FileText, CheckCircle, Calculator } from "lucide-react";

function FileUploader({ onCompare }) {
  const internalRef = useRef(null);
  const providerRef = useRef(null);

  const [internalFileInfo, setInternalFileInfo] = useState(null);
  const [providerFileInfo, setProviderFileInfo] = useState(null);

  const handleFileUpload = (e, setFileInfo) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const content = event.target.result;
      const lines = content.split("\n").filter((line) => line.trim() !== "");
      const numTransactions = lines.length - 1; // assumes 1 header row
      setFileInfo({
        name: file.name,
        transactions: Math.max(0, numTransactions),
      });
    };
    reader.readAsText(file);
  };

  const handleCompareClick = () => {
    const internalFile = internalRef.current.files[0];
    const providerFile = providerRef.current.files[0];
    onCompare(internalFile, providerFile);
  };

  const bothFilesUploaded = internalFileInfo && providerFileInfo;

  const FileUploadButton = ({ fileInfo, onChange, inputRef }) => (
    <>
      {!fileInfo ? (
        <label className="flex items-center gap-2 bg-[#18181B] hover:bg-[#27272A] text-white px-4 py-2 rounded cursor-pointer w-fit">
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
          <input
            type="file"
            ref={inputRef}
            accept=".csv"
            className="hidden"
            onChange={onChange}
          />
        </label>
      ) : (
        <div className="flex items-center gap-2 bg-[#18181B] text-green-400 px-4 py-2 rounded w-fit">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>File Loaded</span>
        </div>
      )}

      {fileInfo && (
        <div className="mt-3 space-y-1 text-sm">
          <div className="flex items-center gap-2 text-white">
            <FileText className="w-4 h-4" />
            <span>{fileInfo.name}</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>{fileInfo.transactions} transactions loaded</span>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Mini Reconciliation Tool</h1>
        <p className="text-[#A1A1AA]">
          Compare transactions between your internal system and payment provider
        </p>
      </div>

      {/* Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {/* Internal System Export */}
        <div className="border border-gray-700 p-6 rounded-lg bg-[#09090B] shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Internal System Export</h2>
          <p className="text-[#A1A1AA] mb-4">
            Upload your internal transaction data (CSV format)
          </p>
          <h3 className="mb-2">Choose Internal CSV File</h3>
          <FileUploadButton
            fileInfo={internalFileInfo}
            onChange={(e) => handleFileUpload(e, setInternalFileInfo)}
            inputRef={internalRef}
          />
        </div>

        {/* Provider Statement */}
        <div className="border border-gray-700 p-6 rounded-lg bg-[#09090B] shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Provider Statement</h2>
          <p className="text-[#A1A1AA] mb-4">
            Upload your provider's transaction data (CSV format)
          </p>
          <h3 className="mb-2">Choose Provider CSV File</h3>
          <FileUploadButton
            fileInfo={providerFileInfo}
            onChange={(e) => handleFileUpload(e, setProviderFileInfo)}
            inputRef={providerRef}
          />
        </div>
      </div>

      {/* Compare Section */}
      {bothFilesUploaded && (
        <div className="w-full text-center mt-10">
          <Calculator className="mx-auto mb-2 text-white" size={32} />
          <h2 className="text-xl font-semibold mb-2">Ready to Compare</h2>
          <p className="text-[#A1A1AA] mb-4">
            Both files have been uploaded. Click the button below to start the
            reconciliation process.
          </p>
          <button
            onClick={handleCompareClick}
            className="bg-[#E2E2E2] text-black px-6 py-2 rounded flex items-center gap-2 justify-center mx-auto hover:bg-gray-300"
          >
            <Calculator size={18} />
            <span>Compare Transactions</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
