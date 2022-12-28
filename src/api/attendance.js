import axios from "@/api/util/httpUtil";

function listAttendances() { 
    const instance = axios.create({
        baseURL: "http://localhost/eduo",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": `Bearer ${localStorage.getItem("access-token")}`
        }
    });
    return instance;
}

export { listAttendances }