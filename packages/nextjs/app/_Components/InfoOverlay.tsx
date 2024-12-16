"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineInfoCircle } from "react-icons/ai";

const InfoPopup: React.FC = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={() => setIsPopupVisible(!isPopupVisible)}
        className="text-white text-2xl bg-blue-500 hover:bg-blue-600 p-2 rounded-full shadow-md focus:outline-none"
        aria-label="Info"
      >
        <AiOutlineInfoCircle />
      </button>

      {isPopupVisible && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
    <div className="relative bg-white rounded-lg shadow-lg max-w-[90%] max-h-[90%] overflow-hidden p-4">
      {/* Close Button */}
      <button
        onClick={() => setIsPopupVisible(false)}
        className="absolute top-3 right-3 text-red-500 hover:text-red-600 text-2xl focus:outline-none"
        aria-label="Close"
      >
        &times;
      </button>

      {/* Content Container */}
      <div className="w-full flex flex-col items-center">
        {/* Title */}
        <h2 className="block font-medium text-black text-lg text-center mb-4">
          Welcome to Rock, Paper, Scissors on the blockchain! This is the final project for the encode club EVM certification.
        </h2>

        {/* Image */}
        <Image
          src="/image.png"
          alt="Tutorial"
          layout="intrinsic"
          width={1000}
          height={600}
          className="rounded-lg"
        />
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default InfoPopup;
