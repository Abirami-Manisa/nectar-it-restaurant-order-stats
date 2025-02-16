const InsightsModal = ({ isOpen, onClose, insight }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
        <h2 className="text-xl font-semibold mb-2">{`Insight from ${insight.title} chart`}</h2>
        <p className="text-gray-700">{insight.insight}</p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InsightsModal;
