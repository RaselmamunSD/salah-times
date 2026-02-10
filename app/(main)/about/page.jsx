import AboutHeader from "@/app/components/about/AboutHeader";
import FAQ from "@/app/components/about/FAQ";
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
      <FAQ />
    </>
  );
};

export default About;
