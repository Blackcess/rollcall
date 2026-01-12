import { useEffect } from "react";
import { useAuth } from "../../Aunthentication/AuthProvider";
import UnderConstruction from "../Util Components/Under Construction/UnderConstruction";
import "./About.css"
function About() {
    let sessionData= useAuth();
  return (
    <div className="about-sectuion-template">
      <UnderConstruction/>
    </div>
  );
}

export default About;