import { useState } from "react";
import { FaPaperPlane, FaPaperclip } from "react-icons/fa";

const FileUpload = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async () => {
    if (!message.trim() && !file) return;

    const formData = new FormData();
    formData.append("message", message);
    if (file) formData.append("file", file);

    const response = await fetch("http://localhost:8083/api/v1/message", {
      method: "POST",
      body: formData,
    });

    const newMessage = await response.json();
    setMessages([...messages, newMessage]);

    setMessage("");
    setFile(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 border rounded-lg shadow-lg">
      <div className="overflow-y-auto mb-4 p-2 border rounded">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <p className="bg-gray-200 p-2 rounded-lg inline-block">
              {msg.text}
            </p>
            {msg.fileUrl && (
              <a
                href={msg.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 block"
              >
                📎 {msg.fileName}
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="file"
          className="hidden"
          id="fileInput"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="fileInput" className="cursor-pointer">
          <FaPaperclip className="text-gray-500" size={20} />
        </label>
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
