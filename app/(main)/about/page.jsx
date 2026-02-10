import AboutHeader from "@/app/components/about/AboutHeader";
import HowWeCollect from "@/app/components/about/HowWeCollect";
import OurMission from "@/app/components/about/OurMission";
import TrustAndSecurity from "@/app/components/about/TrustAndSecurity";

const About = () => {
  return (
    <>
      <AboutHeader />
      <OurMission />
      <HowWeCollect />
      <TrustAndSecurity />
    </>
  );
};

export default About;
