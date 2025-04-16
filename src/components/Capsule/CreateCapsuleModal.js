import { useState } from "react";

export default function CreateCapsuleModal({ isOpen, onClose, onAdd }) {
  const [capsule, setCapsule] = useState({
    capsule_title: "",
    capsule_description: "",
    capsule_date: "",
  });

  const [error, setError] = useState(""); // Validation state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
  };

  const handleChange = (e) => {
    setCapsule({ ...capsule, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!capsule.capsule_title || !capsule.capsule_date || !capsule.capsule_description) {
      setError("All fields are required!"); // Show error if any field is empty
      return;
    }

    const createdCapsule = await onAdd(
      capsule.capsule_title,
      capsule.capsule_date,
      capsule.capsule_description
    );

    if (createdCapsule && createdCapsule.capsule_id) {
      setIsUploading(true);
      await handleUpload(createdCapsule.capsule_id, uploadedFiles); // Upload files after capsule creation
      setIsUploading(false);
    }
    setCapsule({ capsule_title: "", capsule_description: "", capsule_date: "" });
    setUploadedFiles([]);
    onClose();
  };

  const handleUpload = async (capsuleId, files) => {
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/capsule/${capsuleId}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      console.log("Files uploaded successfully:", data.files);
    } catch (error) {
      console.error("Upload error:", error);
      setError("Files upload failed.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] text-black">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[500px] border border-gray-300">
        {/* Uploading message */}
        {isUploading && (
          <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] text-black">
            <div className="bg-white p-6 rounded-xl shadow-lg w-[300px] border border-gray-300 flex items-center justify-center">
              <p className="text-black text-3xl font-bold">Uploading...</p>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-courier text-center mb-4">
          Create Capsule
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Capsule Name */}
          <label
            htmlFor="title"
            className="block font-bold text-lg font-courier"
          >
            Capsule Title:
          </label>
          <input
            id="title"
            type="text"
            name="capsule_title"
            value={capsule.capsule_title}
            onChange={handleChange}
            placeholder="Please enter capsule title..."
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
          />

          {/* Message */}
          <label
            htmlFor="description"
            className="block font-bold text-lg font-courier"
          >
            Description:
          </label>
          <textarea
            id="description"
            name="capsule_description"
            value={capsule.capsule_description}
            onChange={handleChange}
            placeholder="Please enter capsule description..."
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 h-28"
          ></textarea>

          {/* Date */}
          <label
            htmlFor="date"
            className="block font-bold text-lg font-courier"
          >
            Date:
          </label>
          <input
            id="date"
            type="date"
            name="capsule_date"
            value={capsule.capsule_date}
            min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
          />

          {/* Error Message */}
          {error && <p className="text-red-500 font-bold">{error}</p>}

          {/* Upload Button */}
          <div>
            <label className="mt-2 px-4 py-2 text-lg font-bold font-courier bg-gray-300 text-gray-800 rounded-xl shadow-sm">
              Upload
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <ul className="text-gray-700 overflow-auto max-h-32 mt-2">
              {uploadedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="px-4 py-2 text-lg font-bold font-courier bg-gray-300 text-gray-800 rounded-xl shadow-sm cursor-pointer"
              onClick={handleSubmit}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-lg font-bold font-courier bg-gray-300 text-gray-800 rounded-xl shadow-sm cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
