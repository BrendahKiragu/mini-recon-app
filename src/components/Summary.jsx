import Download from "./download";

function Summary({ data }) {
  const exportCSV = (items, filename) => {
    if (!items.length) return;
    const keys = Object.keys(items[0]).filter(
      (k) => k !== "provider" && k !== "matchStatus"
    );
    const csv = [
      keys.join(","),
      ...items.map((row) => keys.map((k) => row[k]).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  const { matched, internalOnly, providerOnly } = data;

  return (
    <div className="space-y-8">
      <Download
        title="✅ Matched Transactions"
        items={matched.map((item) => {
          const provider = item.provider || {};
          const mismatch = item.matchStatus === "Mismatch";
          return mismatch
            ? `Mismatch in amount/status for ${item.transaction_reference}
  Internal: ${item.amount}, ${item.status}
  Provider: ${provider.amount}, ${provider.status}`
            : `Match: ${item.transaction_reference}`;
        })}
        onExport={() => exportCSV(matched, "matched.csv")}
      />

      <Download
        title="⚠️ Present only in Internal file"
        items={internalOnly.map((i) => i.transaction_reference)}
        onExport={() => exportCSV(internalOnly, "internal-only.csv")}
      />

      <Download
        title="❌ Present only in Provider file"
        items={providerOnly.map((i) => i.transaction_reference)}
        onExport={() => exportCSV(providerOnly, "provider-only.csv")}
      />
    </div>
  );
}

export default Summary;
