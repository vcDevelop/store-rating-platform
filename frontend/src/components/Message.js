function Message({ type = "error", text }) {
  if (!text) return null;

  return (
    <div
      className={`p-3 mb-3 rounded text-sm ${
        type === "error"
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {text}
    </div>
  );
}

export default Message;
