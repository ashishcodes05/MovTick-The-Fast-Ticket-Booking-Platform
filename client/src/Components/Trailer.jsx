import { Cross, XCircle } from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

const Trailer = ({ isOpen, closeModal, videoId }) => {
    if(!videoId){
        toast.error("Trailer not available");
        return null;
    };
  return createPortal(
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
            <div className="fixed inset-0 bg-black/80"></div>
          <div className="relative bg-primary/10 h-[calc(100vh-32rem)] md:h-[calc(100vh-8rem)] flex justify-center items-center w-full max-w-3xl p-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 m-2 text-white text-2xl font-bold hover:text-red-400 cursor-pointer"
            >
              <XCircle className="w-6 h-6" />
            </button>

            {/* YouTube Iframe */}
            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="YouTube Video"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.getElementById("trailer-root")
  );
};

export default Trailer;
