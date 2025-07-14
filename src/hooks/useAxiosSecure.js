import axios from "axios";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { app } from "../firebase/firebase.config";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosSecure = () => {
  const auth = getAuth(app);

  useEffect(() => {
    const intercept = axiosSecure.interceptors.request.use(async (config) => {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken(true);  "force refresh"
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      axiosSecure.interceptors.request.eject(intercept);
    };
  }, [auth]);

  return axiosSecure;
};

export default useAxiosSecure;
