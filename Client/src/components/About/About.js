import { useEffect } from "react";
import { useAuth } from "../../Aunthentication/AuthProvider";
import UnderConstruction from "../Util Components/Under Construction/UnderConstruction";
function About() {
    let sessionData= useAuth();
  return (
    <div>
      <UnderConstruction/>
    </div>
  );
}

export default About;