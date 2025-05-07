import a  from "axios";

export const axios = a.create({
withCredentials:true,
baseURL:import.meta.env.VITE_URLBACKEND,
})