// components/Modal.jsx
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  const cleanFulltext = (html) => {
    if (!html) return "";
    let cleaned = html;

    // Remove all <img> tags
    cleaned = cleaned.replace(/<img[^>]*>/gi, "");

    // Remove center-aligned captions or empty centered divs
    cleaned = cleaned.replace(
      /<div[^>]*text-align\s*:\s*center[^>]*>[\s\S]*?<\/div>/gi,
      ""
    );

    // Optionally remove empty spans/divs left over
    cleaned = cleaned.replace(/<div[^>]*>\s*<\/div>/gi, "");

    return cleaned;
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[900px] max-h-[90vh] overflow-y-auto relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
