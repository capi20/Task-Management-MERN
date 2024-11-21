import axios from "axios";

export const serverInstance = axios.create({
	baseURL: "http://localhost:5000/",
	withCredentials: true
});
