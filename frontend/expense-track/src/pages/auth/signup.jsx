import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserContext } from '../../context/userContext';
import { validateEmail } from '../../utils/helper';
import Input from '../../components/inputs/input';
import ProfilePhotoSelector from '../../components/inputs/ProfilePictureSelector';
import AuthLayout from '../../components/layouts/AuthLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH, BASE_URL } from '../../utils/apipath';
import { uploadImage } from '../../utils/uploadImage';

const SignUp = () => {
    const [profilepic, setProfilepic] = useState(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { updateUser } = useUserContext();
    const navigate = useNavigate();

    //handle sign up
    const handleSignUp = async (e) => {
        e.preventDefault();

        let profilepicUrl = "";
        if (!fullName) {
            setError('Please enter a full name');
            return;
        }
       


        if(!validateEmail(email)){
            setError('Please enter a valid email address');
            return;
        }
        if(!password){
            setError('Please enter a password');
            return;
        }
        setError(null);
        //sign up api call
        try {
            console.log('Starting signup process...');
            let profilepicUrl = "";
            
            // Upload profile picture if present
            if (profilepic) {
                console.log('Uploading profile picture...');
                try {
                    const imageUploadRes = await uploadImage(profilepic);
                    profilepicUrl = imageUploadRes?.imageUrl || "";
                    console.log('Profile picture uploaded successfully');
                } catch (uploadError) {
                    console.error('Error uploading profile picture:', uploadError);
                    setError('Failed to upload profile picture. Please try again.');
                    return;
                }
            }

            // Prepare the request data
            const requestData = {
                fullName,
                email,
                password,
                profilepicUrl,
            };

            
            try {
                // Log the full request details before sending
                

                // Add timeout to prevent hanging
                const response = await axiosInstance.post(API_PATH.AUTH.SIGNUP, requestData, {
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                console.log('Response status:', response.status);
                console.log('Response data:', response.data);

                const { token, user } = response.data || {};
                
                if (token && user) {
                    console.log('Signup successful, storing token and user data');
                    localStorage.setItem('token', token);
                    
                    if (updateUser) {
                        updateUser(user);
                        console.log('User context updated');
                    }
                    
                    console.log('Navigating to /dashboard');
                    navigate('/dashboard');
                } else {
                    console.error('Invalid response format:', response.data);
                    setError('Invalid response from server. Please try again.');
                }
            } catch (error) {
                console.error('Signup error:', error);
                
                if (error.response) {
                    // Server responded with an error status code
                    console.error('Server error:', error.response);
                    console.error('Error status:', error.response.status);
                    console.error('Error data:', error.response.data);
                    
                    if (error.response.status === 404) {
                        setError('Server endpoint not found. Please check if the backend is running.');
                    } else if (error.response.status === 400) {
                        setError(error.response.data?.message || 'Bad request. Please check your input.');
                    } else {
                        setError(error.response.data?.message || 
                               error.response.data?.error || 
                               'Signup failed. Please try again.');
                    }
                } else if (error.request) {
                    // Request was made but no response received
                    console.error('No response received:', error.request);
                    setError('No response from server. Please check your connection and ensure the backend is running.');
                } else {
                    // Something else went wrong
                    console.error('Error details:', error.message);
                    console.error('Error config:', error.config);
                    setError('Failed to process signup request. Please try again.');
                }
            }
        } catch (error) {
            console.error('Signup error:', error);
            
            if (error.response) {
                // Server responded with an error status code
                console.error('Error response data:', error.response.data);
                console.error('Error status:', error.response.status);
                
                if (error.response.status === 404) {
                    setError('Server endpoint not found. Please check if the backend is running.');
                } else {
                    const errorMessage = error.response.data?.message || 
                                     error.response.data?.error || 
                                     'Signup failed. Please try again.';
                    setError(errorMessage);
                }
            } else if (error.request) {
                // Request was made but no response received
                console.error('No response received:', error.request);
                setError('No response from server. Please check your connection and ensure the backend is running.');
            } else {
                // Something else went wrong
                console.error('Error setting up request:', error.message);
                setError('Failed to process signup request. Please try again.');
            }
        }
    }
    return(
        <AuthLayout>
    <div>

    <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-centre mt-30">
            <h3 className="text-xl font-semibold text-black ">Create An Account</h3>
            <p className="text-xs text-slate-700 mt-[5px] mb-6">
                Join us today by entering your details below
                </p>

                <form onSubmit={handleSignUp}>

                <ProfilePhotoSelector image={profilepic} setImage={setProfilepic}/>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                            <Input
                                label="Full Name"
                                value={fullName}
                                onChange={({target}) => setFullName(target.value)}
                                type="text"
                                placeholder="John Doe"
                                required
                            />
                        
                        
                            <Input
                                label="Email Address"
                                value={email}
                                onChange={({target}) => setEmail(target.value)}
                                type="email"
                                placeholder="john@example.com"
                                required
                            />
                            <div className="col-span-2">
                        
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

                       {error && <p className="text-red-500 mt-2">{error}</p>}
                       
                       {/* Sign Up Button */}
                       <button 
                           type="submit"
                           className="w-full bg-violet-500 text-white py-2 px-4 rounded-md hover:bg-violet-600 transition-colors duration-200 mt-4"
                           onClick={handleSignUp}
                       >
                           Sign Up
                       </button>
                       
                       <div className="flex items-center justify-center my-4">
                           <div className="border-t border-gray-300 w-full"></div>
                           <span className="px-4 text-gray-500 text-sm">OR</span>
                           <div className="border-t border-gray-300 w-full"></div>
                       </div>
                       
                       {/* Login Link */}
                       <div className="text-center">
                           <span className="text-sm text-slate-600">Already have an account? </span>
                           <Link 
                               to="/login" 
                               className="text-sm font-medium text-violet-600 hover:text-violet-700 hover:underline"
                           >
                               Login here
                           </Link>
                       </div>
                    
                </form>



        </div>
    </div>
    </AuthLayout>
    )
}
export default SignUp;