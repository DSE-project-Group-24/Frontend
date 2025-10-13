import { X } from 'lucide-react';

const DetailsModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  // Sort the data entries by count in descending order
  const sortedData = Object.entries(data.values).sort(([, a], [, b]) => b - a);

  return (
    // Backdrop
    <div 
      onClick={onClose} 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
    >
      {/* Modal Content */}
      <div 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{data.title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body (Scrollable List) */}
        <div className="p-6 overflow-y-auto">
          <ul className="space-y-3">
            {sortedData.map(([key, value]) => (
              <li key={key} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="text-sm font-medium text-gray-800">{key}</span>
                <span className="text-base font-bold text-blue-600">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;