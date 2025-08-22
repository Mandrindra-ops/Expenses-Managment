import { useState, useEffect } from "react"

export default function Login(){
    const [isLoginMode , setisLoginMode] =useState(true) 

    return (
        <div className="w-[430px] bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex justify-center mb-4">
                <h2 className="text-3xl font-semibold text-center">{isLoginMode ? "Login" : "Sign up"}</h2>
            </div>
            <div className="relative flex h-12 mb-6 border border-gray-300 rounded-full overflow-hidden">
                <button onClick ={()=>setisLoginMode(true)} className={`w-1/2 text-lg font-medium transition-all z-10 ${isLoginMode ? "text-white": "text-black"}`}>
                    Log in
                </button>
                <button onClick={()=>setisLoginMode(false)} className={`w-1/2 text-lg font-medium transition-all z-10 ${ !isLoginMode ? "text-white": "text-black"}`}>
                    Sign up
                </button>
                <div className={`absolute top-0 h-full w-1/2 rounded-full bg-gradient-to-r from-blue-700 via-cyan-600 to bg-cyan-200 transition-all duration-500 ease-in-out ${isLoginMode ? "left-0": "left-1/2"}`}> </div>
            </div>
                <form className="space-y-4">
                    { !isLoginMode && (
                        <input type="text" name = "username"  placeholder="Your name" required
                        className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"/>
                    )}
                    <input type="email" name="email" placeholder="Email Address" required
                    className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"/>
                    <input type="password" name="password" placeholder="Password" required 
                    className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"/>
                    { !isLoginMode && (
                        <input type="password" name="password2" placeholder="Confirm Password" required 
                        className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"/>  
                    )}
                    {/* { isLoginMode && (
                        <div className="text-right">
                            <p className="text-cyan-600 hover:underline">Forget Password</p>
                        </div>
                    )} */}
                    <button
                        className="w-full p-3 bg-gradient-to-r from-blue-700 via-cyan-600 to bg-cyan-200 text-white rounded-full text-lg font-medium hover:opacity-90 transition"> 
                        {isLoginMode ? "Login" : " Sign up"}
                    
                    </button>
                    <p className="text-center text-gray-600">
                        {isLoginMode ? "Don't have an account": "Already have an account"}
                        <a href="#" onClick={()=> setisLoginMode(!isLoginMode)} className="text-cyan-600 hover:underline">
                            {isLoginMode ? "Sign up now": "Log in"}
                        </a>
                    </p>
                </form>

        </div>        
    )
}