import { useEffect } from "react";
import { useAuth } from "../../Aunthentication/AuthProvider";

function About() {
    let sessionData= useAuth();

  useEffect(()=>{
    console.log("This is my sessiondata: ",sessionData)
  })
  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page of the application.</p>
    </div>
  );
}

export default About;