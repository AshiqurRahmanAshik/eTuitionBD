import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";

const SocialLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Try to register user in backend (default role: student)
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/register`,
          {
            name: user.displayName,
            email: user.email,
            password: user.uid,
            role: "student",
            phone: user.phoneNumber || "",
            photoURL: user.photoURL || "",
          }
        );

        localStorage.setItem("token", response.data.token);
        navigate(location?.state || "/");
      } catch (error) {
        // If user exists, try to login
        if (error.response?.status === 400) {
          const loginResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/login`,
            {
              email: user.email,
              password: user.uid,
            }
          );

          localStorage.setItem("token", loginResponse.data.token);
          navigate(location?.state || "/");
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <div className="mt-6">
      <div className="divider">OR</div>
      <button onClick={handleGoogleLogin} className="btn btn-outline w-full">
        <FaGoogle className="mr-2" />
        Continue with Google
      </button>
    </div>
  );
};

export default SocialLogin;
