import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function ShareFile() {
  const [sharefilelink, setsharefilelink] = useState("");
  const [showinputfiled, setshowinputfield] = useState(false);
  const { fileId } = useParams();
  const [showModal, setShowModal] = useState(false);

  const deletesharefilelink = async () => {
    setShowModal(false);
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/files/deletesharelink/${fileId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.msg);
    } else {
      toast.success("Link deleted successfully");
      setsharefilelink("");
      setshowinputfield(false);
    }
  };

  const getsharefilelink = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/files/createsharelink/${fileId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const filedata = await res.json();
    if (!res.ok) {
      console.log("file is not shared");
    } else {
      setsharefilelink(filedata.shareablelink);
      toast.success("Sharable link created successfully");
      setshowinputfield(true);
    }
  };
  const fetchsharefilelink=async()=>{
     const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/files/fetchsharelink/${fileId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const filedata = await res.json();
    if (!res.ok) {
      console.log("file is not shared");
    } else {
      setsharefilelink(filedata.shareablelink);
      toast.success("Sharable link fetched successfully");
      setshowinputfield(true);
    }
  }

  useEffect(() => {
    fetchsharefilelink();
  }, []);

  return (
    <>
      <div className="bg-gray-100 flex flex-col items-center justify-center h-[500px] space-y-6">
        {showinputfiled && (
          <div className="flex flex-col items-center space-y-3">
            <input
              value={sharefilelink}
              readOnly
              className="border border-gray-400 rounded-lg px-3 py-2 w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(sharefilelink);
                toast.info("Link copied to clipboard!");
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              Copy Link
            </button>
          </div>
        )}

        {!showinputfiled && (
          <button
            onClick={getsharefilelink}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl shadow-md transition"
          >
            Create Share Link
          </button>
        )}

        {showinputfiled && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl shadow-md transition"
          >
            Delete Share Link
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">
            <h2 className="text-lg font-semibold mb-3">
              Delete Share Link?
            </h2>
            <p className="text-gray-600 mb-5 text-sm">
              Are you sure you want to delete this link? This action cannot be
              undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={deletesharefilelink}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShareFile;
