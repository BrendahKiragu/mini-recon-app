function Download({ title, items, onExport }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <pre className="bg-white p-3 rounded shadow overflow-auto max-h-60 whitespace-pre-wrap">
        {items.join("\n")}
      </pre>
    </div>
  );
}

export default Download;
