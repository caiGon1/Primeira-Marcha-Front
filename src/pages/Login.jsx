import { useNavigate } from "react-router-dom";

function Login() {
    const navigator = useNavigate();

    return (
        
        <div className="h-screen w-screen flex items-center justify-center">
        <div className='p-4 rounded flex gap-2 w-fit flex-col items-center justify-center  border-2 '>
            <h1>Login</h1>
            <form className="flex flex-col gap-2" action="/dashboard" method="post" >
                <div className='grid grid-cols-[auto_auto] gap-2'>
                    <label htmlFor="email">Email:</label>
                    <input className="border-2 rounded" type="email" id="email" name="email" required />
                
                    <label htmlFor="password">Password:</label>
                    <input className="border-2 rounded" type="password" id="password" name="password" required />
                </div>
                <button onClick={()=>navigator('/dashboard')} className="border-2 rounded " type="submit">Login</button>
            </form>
            </div>
        </div>
     );
}

export default Login;