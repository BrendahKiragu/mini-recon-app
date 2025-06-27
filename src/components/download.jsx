function Download({ title, items, onExport }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <pre className="bg-white p-3 rounded shadow overflow-auto max-h-60 whitespace-pre-wrap">
        {items.join("\n")}
      </pre>
      <button
        onClick={onExport}
        className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
      >
        Export as CSV
      </button>
    </div>
  );
}

export default Download;
