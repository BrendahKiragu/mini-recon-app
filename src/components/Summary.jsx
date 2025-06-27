import { useState } from "react";

function Summary({ data }) {
  const { matched, internalOnly, providerOnly } = data;
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const total = matched.length + internalOnly.length + providerOnly.length;
  const matchRate =
    total > 0 ? ((matched.length / total) * 100).toFixed(1) : "0.0";

  const amountMismatches = matched.filter(
    (tx) => tx.amount !== tx.provider_amount
  ).length;
  const statusMismatches = matched.filter(
    (tx) => tx.status !== tx.provider_status
  ).length;

  const exportCSV = (items, filename) => {
    if (!items.length) return;
    const keys = Object.keys(items[0]);
    const csv = [keys.join(",")]
      .concat(items.map((row) => keys.map((k) => row[k]).join(",")))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderTable = (title, items, color, filename) => {
    if (!items.length) return null;

    const excludeKeys = ["source"];
    if (title.includes("Matched")) {
      excludeKeys.push("provider_status", "provider_amount", "matched");
    }

    const headers = Object.keys(items[0]).filter(
      (k) => !excludeKeys.includes(k)
    );
    const preview = expandedSections[title] ? items : items.slice(0, 10);

    return (
      <div className=" bg-[#09090B] rounded-lg p-4 border border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className={`font-semibold ${color}`}>
              {title} ({items.length})
            </h3>
            <p className="text-sm text-gray-400">
              Transactions in the {filename} file
            </p>
          </div>
          <button
            onClick={() => exportCSV(items, filename)}
            className="flex items-center gap-2 bg-white text-black text-xs px-3 py-1 rounded hover:bg-[#4ADE80]"
          >
            Export as CSV
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-2">
          {preview.length} transaction{preview.length !== 1 && "s"}
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-700 rounded">
            <thead className="bg-gray-800 text-left text-white">
              <tr>
                {headers.map((col, i) => (
                  <th key={i} className="px-4 py-2">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, idx) => (
                <tr key={idx} className="border-t border-gray-700 text-white">
                  {headers.map((key, i) => (
                    <td key={i} className="px-4 py-2">
                      {row[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {items.length > 10 && (
            <div className="text-center mt-2">
              <button
                onClick={() => toggleSection(title)}
                className="text-xs text-blue-400 hover:underline"
              >
                {expandedSections[title] ? "Show less" : "Show all"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#09090B] text-white p-6 space-y-6">
      {/* Summary Header Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-[#052E16] p-4 rounded">
          <h2 className="text-3xl font-bold text-[#22C55E]">
            {matched.length}
          </h2>
          <p>Matched</p>
        </div>
        <div className="bg-[#422006] p-4 rounded">
          <h2 className="text-3xl font-bold text-[#EAB308]">
            {internalOnly.length}
          </h2>
          <p>Internal Only</p>
        </div>
        <div className="bg-[#431407] p-4 rounded">
          <h2 className="text-3xl font-bold text-[#EF4444]">
            {providerOnly.length}
          </h2>
          <p>Provider Only</p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-3xl font-bold">{matchRate}%</h2>
          <p>Match Rate</p>
        </div>
      </div>

      {/* Mismatch Panel */}
      {(amountMismatches > 0 || statusMismatches > 0) && (
        <div className="bg-[#7c2d12] text-orange-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            ⚠ Data Mismatches Detected
          </h3>
          <ul className="list-disc ml-5 space-y-1 text-sm">
            {amountMismatches > 0 && (
              <li>
                {amountMismatches} transactions with <strong>amount</strong>{" "}
                mismatches
              </li>
            )}
            {statusMismatches > 0 && (
              <li>
                {statusMismatches} transactions with <strong>status</strong>{" "}
                mismatches
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Matched */}
      {renderTable(
        "✅ Matched Transactions",
        matched,
        "text-green-400",
        "matched.csv"
      )}

      {/* Internal Only */}
      {renderTable(
        "⚠️ Internal Only",
        internalOnly,
        "text-yellow-400",
        "internal_only.csv"
      )}

      {/* Provider Only */}
      {renderTable(
        "❌ Provider Only",
        providerOnly,
        "text-red-400",
        "provider_only.csv"
      )}
    </div>
  );
}

export default Summary;
