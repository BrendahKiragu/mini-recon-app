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
  };

  return (
    <>
      <FileUploader onCompare={handleCompare} />
      {summary && <Summary data={summary} />}
      <footer className="text-center text-xl bg-[#09090B] text-[#A1A1AA]">
        Bree-Tech Mini Reconciliation Tool @ 2025
      </footer>
    </>
  );
}

export default App;
