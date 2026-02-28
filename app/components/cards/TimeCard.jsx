import React from "react";

const TimeCard = ({ time, isNext }) => {
  return (
    <div
      className={`border rounded-[14px] p-[18px] space-y-2 text-center relative ${
        isNext
          ? "border-[#1F8A5B] border-2 bg-gradient-to-br from-[#E9F5F0] to-[#EEF7FB]"
          : "border-gray-200"
      }`}
    >
      {/* Prayer Name */}
      <h3 className="text-[#64748B] text-xs md:text-[14px] font-medium">
        {time.waqt}
      </h3>

      {/* Beginning Time or Sunrise/Sunset */}
      {time.subTime && (
        <p className="text-[#64748B] text-[10px] md:text-xs">
          {time.subLabel} {time.subTime}
        </p>
      )}

      {/* Main Time (Iqamah) */}
      <h3
        className={`font-bold text-lg md:text-[24px] ${
          isNext ? "text-[#1F8A5B]" : "text-[#1E293B]"
        }`}
      >
        {time.time}
      </h3>

      {/* Iqamah Label - Only for prayer times, not Sunrise */}
      {time.waqt !== "Sunrise" && (
        <p className="text-[#64748B] text-[10px] md:text-xs">Iqamah</p>
      )}

      {/* Next Badge */}
      {isNext && (
        <div className="absolute top-3 right-3 bg-[#1F8A5B] text-white text-[10px] px-2 py-1 rounded-full font-medium">
          ⏰ Next
        </div>
      )}
    </div>
  );
};

export default TimeCard;
