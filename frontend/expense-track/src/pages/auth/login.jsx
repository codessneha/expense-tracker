import { useState } from 'react';
import { useUserContext } from '../../context/userContext';
import { validateEmail } from '../../utils/helper';
import Input from '../../components/inputs/input';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from "../../utils/apipath";

import AuthLayout from '../../components/layouts/AuthLayout';
const Login=()=>{
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [error,setError]=useState(null);
    const navigate=useNavigate();

    const { updateUser}= useUserContext();

    //handle login form submit
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (!password) {
            setError('Please enter a password');
            return;
        }

        console.log('Attempting login with:', { email });
        
        try {
            const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, {
                email,
                password,
            });
            
            console.log('Login response:', response);
            
            // Extract token and user from the nested data property
            const { data: { token, ...userData }, message, success } = response.data || {};
            
            if (token && success) {
                console.log('Login successful, storing token');
                localStorage.setItem("token", token);
                
                if (updateUser) {
                    console.log('Updating user context with:', userData);
                    updateUser({ ...userData, token });
                } else {
                    console.error('updateUser function is not available');
                }
                
                console.log('Navigating to /dashboard');
                navigate('/dashboard');
            } else {
                console.error('No token in response:', response.data);
                setError('Login failed: No token received');
            }
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error status:', error.response.status);
                
                if (error.response.status === 401) {
                    setError('Invalid email or password');
                } else {
                    setError(error.response.data?.message || 'Login failed. Please try again.');
                }
            } else if (error.request) {
                console.error('No response received:', error.request);
                setError('No response from server. Please check your connection.');
            } else {
                console.error('Error setting up request:', error.message);
                setError('Failed to process login. Please try again.');
            }
        }
        
    }

    return(
        <AuthLayout>
    <div>
        <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-centre mt-40">
            <h3 className="text-xl font-semibold text-black ">Welcome Back</h3>
            <p className="text-xs text-slate-700 mt-[5px] mb-6">
                Please enter your login details
                </p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Input
                                label="Email Address"
                                value={email}
                                onChange={({target}) => setEmail(target.value)}
                                type="email"
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <Input
                                label="Password"
                                value={password}
                                onChange={({target}) => setPassword(target.value)}
                                type="password"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200"
                        >
                            Sign In
                        </button>
                    </div>

                    <div className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link 
                            to="/signup" 
                            className="font-medium text-violet-600 hover:text-violet-700 hover:underline"
                        >
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
</AuthLayout>
    )
}
export default Login;