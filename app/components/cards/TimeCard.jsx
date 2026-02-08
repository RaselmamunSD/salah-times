import React from "react";

const TimeCard = ({ time }) => {
  return (
    <div className="border border-gray-200 rounded-[14px] p-[18px] space-y-2 text-center">
      <h3 className="text-[#64748B] text-[14px] rounded-[14px]">{time.waqt}</h3>
      <h3 className="text-[#1E293B] font-semibold text-[20px]">{time.time}</h3>
    </div>
  );
};

export default TimeCard;
