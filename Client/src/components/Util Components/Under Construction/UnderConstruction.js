import "./UnderConstruction.css"
import { LuConstruction } from "react-icons/lu";
function UnderConstruction(){


    return<>
    <section className="construction-template">
    <div className="construction-body">
        <p className="construction-alert-poster">
            <span><LuConstruction/></span>
            <span>This Section Of RollCall Is Under Construction...</span>
        </p>
    </div>
    </section>
    </>
}

export default UnderConstruction