function Summary({ data }) {
  const { matched, internalOnly, providerOnly } = data;

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

  const renderTable = (title, items, color, filename, sourceLabel) => {
    if (!items.length) return null;

    const excludeKeys = ["source"];
    if (title.includes("Matched")) {
      excludeKeys.push("provider_status", "provider_amount", "matched");
    }

    const headers = Object.keys(items[0]).filter(
      (k) => !excludeKeys.includes(k)
    );
    const preview = items.slice(0, 10);

    return (
      <div className=" bg-[#09090B] rounded-lg p-4 border border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className={`font-semibold ${color}`}>
              {title} ({items.length})
            </h3>
            <p className="text-sm text-gray-400">Transactions {sourceLabel}</p>
          </div>
          <button
            onClick={() => exportCSV(items, filename)}
            className="flex items-center gap-2 bg-white text-black text-xs px-3 py-1 rounded hover:bg-gray-200"
          >
            <span className="material-icons">download</span> Export CSV
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
            <div className="text-xs text-gray-400 px-4 py-2">
              Showing first 10 of {items.length} transactions
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#09090B] text-white p-6 rounded-xl mt-8 space-y-6">
      {/* Summary Header Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-green-900/20 p-4 rounded">
          <h2 className="text-3xl font-bold text-green-400">
            {matched.length}
          </h2>
          <p>Matched</p>
        </div>
        <div className="bg-yellow-900/20 p-4 rounded">
          <h2 className="text-3xl font-bold text-yellow-400">
            {internalOnly.length}
          </h2>
          <p>Internal Only</p>
        </div>
        <div className="bg-red-900/20 p-4 rounded">
          <h2 className="text-3xl font-bold text-red-400">
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
        "matched.csv",
        true
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
