import { useState } from "react";
import FileUploader from "./components/FileUploader";
import Summary from "./components/Summary";

function parseCSV(text) {
  const [headerLine, ...lines] = text.trim().split("\n");
  const headers = headerLine.split(",");

  return lines.map((line) => {
    const values = line.split(",");
    return headers.reduce((obj, key, i) => {
      obj[key.trim()] = values[i]?.trim();
      return obj;
    }, {});
  });
}

function App() {
  const [summary, setSummary] = useState(null);
  const [hasCompared, setHasCompared] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCompare = async (internalFile, providerFile) => {
    const readFile = (file) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(parseCSV(e.target.result));
        reader.readAsText(file);
      });

    const internalData = await readFile(internalFile);
    const providerData = await readFile(providerFile);

    const internalMap = new Map(
      internalData.map((tx) => [tx.transaction_reference, tx])
    );
    const providerMap = new Map(
      providerData.map((tx) => [tx.transaction_reference, tx])
    );

    const matched = [];
    const internalOnly = [];
    const providerOnly = [];

    for (const [ref, tx] of internalMap) {
      if (providerMap.has(ref)) {
        const providerTx = providerMap.get(ref);
        const isMatch =
          tx.amount === providerTx.amount && tx.status === providerTx.status;

        matched.push({
          ...tx,
          matched: isMatch,
          provider_amount: providerTx.amount,
          provider_status: providerTx.status,
        });
      } else {
        internalOnly.push(tx);
      }
    }

    for (const [ref, tx] of providerMap) {
      if (!internalMap.has(ref)) {
        providerOnly.push(tx);
      }
    }

    setSummary({ matched, internalOnly, providerOnly });
    setHasCompared(true);
  };

  const VideoModal = () =>
    showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-[#18181B] p-4 rounded-lg max-w-3xl w-full relative">
          <button
            className="absolute top-2 right-2 text-white text-xl"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>
          <video
            className="w-full rounded shadow-md"
            controls
            poster="/App thumbnail.png"
          >
            <source src="/App tour.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    );

  return (
    <div className="bg-[#09090B] min-h-screen text-white px-4 py-4 relative">
      <div className="space-y-4">
        <FileUploader onCompare={handleCompare} />

        {!hasCompared && (
          <div className="text-center">
            <button
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
              onClick={() => setShowModal(true)}
            >
              🎥 Watch App Tour
            </button>
          </div>
        )}
      </div>

      {summary && (
        <>
          <div className="mt-6">
            <Summary data={summary} />
          </div>

          <div className="text-center mt-6">
            <button
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
              onClick={() => setShowModal(true)}
            >
              🎥 Watch App Tour Again
            </button>
          </div>
        </>
      )}

      <VideoModal />

      <footer className="text-center text-sm text-[#A1A1AA] mt-8">
        Bree-Tech Mini Reconciliation Tool @ 2025
      </footer>
    </div>
  );
}

export default App;
