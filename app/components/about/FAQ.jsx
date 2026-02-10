import React from "react";

const FAQ = () => {
  const faq = [
    {
      title: "Direct Mosque Integration",
      sub: "We work directly with mosque administrations to receive official prayer schedules, ensuring you get the most accurate times published by your local masjid.",
    },
    {
      title: "AI + Human Verification",
      sub: "Our AI processes incoming data quickly, but every entry is verified by trained administrators to catch any errors before publication.",
    },
    {
      title: "Community Accountability",
      sub: "Users can report discrepancies, and we investigate every report within 24 hours to maintain the highest standards of accuracy.",
    },
    {
      title: "Transparent Process",
      sub: "We're open about our data collection methods and verification processes. If you have questions, our support team is always available.",
    },
  ];
  return (
    <div className="max-w-[1216px] w-full mx-auto rounded-[16px] p-10 my-15 shadow-xl border border-gray-300">
      <h1 className="text-[30px] font-semibold text-[#1E293B] mb-6">
        Why Trust Salaah-Times?
      </h1>
      <div className="space-y-6">
        {faq.map((f) => (
          <>
            <h3 className="font-semibold text-base text-[#1E293B]">
              {f.title}
            </h3>
            <p className="text-base text-[#64748B]">{f.sub}</p>
          </>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
