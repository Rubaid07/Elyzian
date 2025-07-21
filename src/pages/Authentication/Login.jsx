import { use, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../../assets/logo.png';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("")
  const { signIn, signInWithGoogle } = use(AuthContext)

  const handleSignIn = e => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    signIn(email, password)
      .then(result => {
        const user = result.user;
        user.getIdToken().then(token => {
          localStorage.setItem('access-token', token);
          toast.success("Logged in successfully");
          navigate(`${location.state ? location.state : "/"}`);
        });
      })
      .catch(error => {
        const errorCode = error.code
        setError(errorCode)
      })
  }

  const togglePasswordShow = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSignIn = () => {
  signInWithGoogle()
    .then(result => {
      const user = result.user;
      user.getIdToken().then(token => {
        localStorage.setItem('access-token', token);
      });

      // ✅ Backend এ ইউজার ইনফো সেভ করো (PUT ব্যবহার করলে idempotent হয়)
      axios.put(`${import.meta.env.VITE_API_URL}/users/${user.email}`, {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL || 'https://i.ibb.co/5GzXkwq/user.png',
        role: "customer" // default role
      });

      toast.success("Logged in successfully");
      navigate(`${location.state ? location.state : "/"}`);
    })
    .catch(error => {
      toast.error(error.message);
    });
};



  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-10 flex flex-col items-center">
        <img src={logo} alt="Logo" className="h-12 mb-2" />
        <p className="text-gray-500 mt-2">Your trusted partner for life insurance solutions</p>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordShow}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
              </button>
            </div>
          </div>
          {error && <p className='text-red-400 text-xs'>{error}</p>}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-sky-700 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-sky-700 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-700 hover:bg-sky-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-800 transition duration-150"
          >
            Sign in
          </button>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors cursor-pointer"
          >
            <svg aria-label="Google logo" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
              </g>
            </svg>
            Login with Google
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-500">
            Don't have an account?
            <Link to="/register" className="font-medium ml-1 text-sky-700 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;