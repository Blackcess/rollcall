import { useNavigate } from "react-router-dom";
import Login from "./AccessPoint"
import "./LoginFailure.css"
function LoginFailure(props){

    let navigate1  = useNavigate();
    return <>
    <section className="login-failure-template">

        <h2 className="failure-heading">Bad Credentials</h2>
        <div className="failure-body">
            <button className="retry" onClick={()=>{
                props.value.feedback(true)
            }}>Retry</button>
            <button className="create-account" onClick={(e)=>{
                e.preventDefault();
                navigate1("/create-account",{
                    replace:false
              })
            }}>Create Account</button>
        </div>
        <div className="error-display">
                    {props.error.map((err,index)=>{
                        return <p key={index} className="error-text">{err}</p>
                    })}
        </div>
    </section>
    </>
}

export default LoginFailure