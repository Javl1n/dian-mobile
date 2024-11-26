import axios from "axios";
import { API_URL } from "@/constants/config";
import { useSession } from "@/context/session";

const api = axios.create({
     baseURL: API_URL,
     headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
     },
     withCredentials: true,
     withXSRFToken: true,
});

const setBearerToken = (token: string) => {
     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export { api, setBearerToken };