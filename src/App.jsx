import { useState } from "react";
import FileUploader from "./components/FileUploader";
import Summary from "./components/Summary";

function App() {
  const [summary, setSummary] = useState(null);

  const handleCompare = async (internalFile, providerFile) => {
    if (!internalFile || !providerFile) {
      alert("Please upload both files.");
      return;
    }

    const internalData = await parseCSV(internalFile);
    const providerData = await parseCSV(providerFile);

    const matched = [];
    const internalOnly = [];
    const providerOnly = [];

    const providerMap = new Map(
      providerData.map((item) => [item.transaction_reference, item])
    );

    internalData.forEach((item) => {
      const providerItem = providerMap.get(item.transaction_reference);
      if (providerItem) {
        const isMatch =
          item.amount === providerItem.amount &&
          item.status === providerItem.status;
        matched.push({
          ...item,
          matchStatus: isMatch ? "Match" : "Mismatch",
          provider: providerItem,
        });
      } else {
        internalOnly.push(item);
      }
    });

    providerData.forEach((item) => {
      if (
        !internalData.some(
          (i) => i.transaction_reference === item.transaction_reference
        )
      ) {
        providerOnly.push(item);
      }
    });

    setSummary({ matched, internalOnly, providerOnly });
  };

  const parseCSV = async (file) => {
    const text = await file.text();
    const rows = text.trim().split("\n").slice(1);
    return rows.map((row) => {
      const [transaction_reference, amount, status] = row.split(",");
      return {
        transaction_reference,
        amount: amount.trim(),
        status: status.trim(),
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Mini Reconciliation Tool</h1>
        <p className="text-[#A1A1AA]">
          Compare transactions between your internal system and payment provider
        </p>
        <FileUploader onCompare={handleCompare} />
        {summary && <Summary data={summary} />}
      </div>
    </div>
  );
}

export default App;
