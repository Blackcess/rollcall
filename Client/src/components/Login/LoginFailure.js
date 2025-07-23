import Login from "./AccessPoint"
import "./LoginFailure.css"
function LoginFailure(props){

    return <>
    <section className="login-failure-template">

        <h2 className="failure-heading">Bad Credentials</h2>
        <div className="failure-body">
            <button className="retry" onClick={()=>{
                props.value.feedback(true)
            }}>Retry</button>
            <button className="create-account">Create Account</button>
        </div>
    </section>
    </>
}

export default LoginFailure