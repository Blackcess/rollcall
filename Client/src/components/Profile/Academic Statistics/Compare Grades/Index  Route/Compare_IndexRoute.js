import { useEffect, useState } from "react"
import "./Compare_IndexRoute.css"
import { useNavigate } from "react-router-dom";

function CompareIndexRoute(){
       let [password,setPassword] = useState("");
       let [passwordDone,setPasswordDone] = useState(false);
       let premiumCode = "Faith";
       let navigate = useNavigate();

       useEffect(()=>{
            if(passwordDone){
                if(password===premiumCode){
                    navigate("comparison-selection")
                }
                setPasswordDone(false)
            }
            
       },[passwordDone])
    return<>
    <section  className="compare-index-route-section">
        <div className="new-feature-intro">
          <p>   <span className="my-bransd-nam">RollCall </span> has released this new feature. CEO <span style={{color:"blue",textDecoration:"underline"}}>Thomas Kazonda</span> has authorized this comparison model<br/><br/>
            Unfortunately this feature is for Premium Students. Please verify if you are Premium.
        </p>
        </div>
        <div className="verification-compare">
            <form className="form-passcode">
                <h4>Enter Your Premium Passcode </h4>
                <input className="passcode-premium-form" type="password" placeholder="Premium Passcode..." value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
                <button className="verify-password" onClick={(e)=>{
                    e.preventDefault();
                    setPasswordDone(true)
                }}>Enter</button>

            </form>
        </div>
    </section>
    </>
}

export default CompareIndexRoute