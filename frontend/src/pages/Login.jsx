import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  const { setAuthToken } = useAuth();

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        // 1. Exchange Code for Token
        const tokenRes = await axios.post(`${BACKEND_URL}/api/auth/google/`, {
          code: codeResponse.code,
        });
        const token = tokenRes.data.key;

        // Set token in AuthContext so the whole app knows we're authenticated
        const user = await setAuthToken(token);

        // 3. Check "Intent" from Landing Page (Did they click "Become Mentor"?)
        const rolePref = localStorage.getItem('role_preference');

          if (rolePref === 'interviewer') {
            // FLOW: New (or existing) user wants to be a Mentor
            // Ensure their Interviewer Profile is created/active on the backend.
            await axios.get(`${BACKEND_URL}/api/interviewer/profile/`, {
              headers: { Authorization: `Token ${token}` }
            });

            // Refresh the user in AuthContext so `is_interviewer` and `interviewer_status`
            // reflect the newly-created profile before navigating.
            const refreshedUser = await setAuthToken(token);

            localStorage.removeItem('role_preference'); // Clean up
            // Route based on the refreshed state rather than assuming "approved"
            if (refreshedUser?.is_interviewer) {
             // Let the RoleRedirector or direct route handle status pages.
             navigate('/interviewer/dashboard');
            } else {
             // Fallback: if something went wrong, send to regular dashboard
             navigate('/dashboard');
            }

          } else if (rolePref === 'interviewee') {
           // FLOW: User specifically wants to find mentors
           localStorage.removeItem('role_preference');
            navigate('/dashboard');

        } else {
           // FLOW: Generic Login (User clicked "Login" in navbar)
           // Route them based on what they ALREADY are
            if (user.is_interviewer) {
              navigate('/interviewer/dashboard');
            } else {
              navigate('/dashboard');
            }
        }

      } catch (error) {
        console.error("Login Error:", error);
        alert("Login failed! Check console.");
      }
    },
    onError: error => console.log("Google Login Failed:", error),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md text-center border border-gray-100">
        <h1 className="text-3xl font-extrabold mb-2 text-gray-900">Welcome Back</h1>
        <p className="text-gray-500 mb-8">Sign in to continue your prep journey</p>
        
        <button
          onClick={() => googleLogin()}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all font-medium shadow-sm"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;