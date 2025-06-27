function Summary({ data }) {
  const { matched, internalOnly, providerOnly } = data;

  const exportCSV = (items, filename) => {
    if (!items.length) return;
    const keys = Object.keys(items[0]);
    const csvContent = [keys.join(",")]
      .concat(items.map((item) => keys.map((k) => item[k]).join(",")))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#09090B] text-white p-6 rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">Reconciliation Summary</h2>

      <div className="mb-6">
        <h3 className="text-green-400 text-xl mb-2">✅ Matched Transactions</h3>
        <p>Total: {matched.length}</p>
        <button
          onClick={() => exportCSV(matched, "matched.csv")}
          className="text-sm underline mt-2"
        >
          Export as CSV
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-yellow-400 text-xl mb-2">⚠️ Only in Internal</h3>
        <p>Total: {internalOnly.length}</p>
        <button
          onClick={() => exportCSV(internalOnly, "internal_only.csv")}
          className="text-sm underline mt-2"
        >
          Export as CSV
        </button>
      </div>

      <div>
        <h3 className="text-red-400 text-xl mb-2">❌ Only in Provider</h3>
        <p>Total: {providerOnly.length}</p>
        <button
          onClick={() => exportCSV(providerOnly, "provider_only.csv")}
          className="text-sm underline mt-2"
        >
          Export as CSV
        </button>
      </div>
    </div>
  );
}

export default Summary;
