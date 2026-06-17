import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.PROD ? "https://complaint-registeration.onrender.com/api" : "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      // Optional: redirect to login
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: async (credentials) => {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await API.post("/auth/register", userData);
    return response.data;
  },
  getMe: async () => {
    const response = await API.get("/auth/me");
    return response.data;
  },
};

// Complaint endpoints
export const complaintAPI = {
  create: async (complaintData) => {
    const response = await API.post("/complaints", complaintData);
    return response.data;
  },
  getMyComplaints: async () => {
    const response = await API.get("/complaints");
    return response.data;
  },
  getSingle: async (id) => {
    const response = await API.get(`/complaints/${id}`);
    return response.data;
  },
  update: async (id, complaintData) => {
    const response = await API.put(`/complaints/${id}`, complaintData);
    return response.data;
  },
  delete: async (id) => {
    const response = await API.delete(`/complaints/${id}`);
    return response.data;
  },
};

// Admin endpoints
export const adminAPI = {
  getStats: async () => {
    const response = await API.get("/admin/stats");
    return response.data;
  },
  getAllComplaints: async () => {
    const response = await API.get("/admin/complaints");
    return response.data;
  },
  getAgents: async () => {
    const response = await API.get("/admin/agents");
    return response.data;
  },
  getUsers: async () => {
    const response = await API.get("/admin/users");
    return response.data;
  },
  assignAgent: async (complaintId, agentId) => {
    const response = await API.put(`/admin/assign/${complaintId}`, { agentId });
    return response.data;
  },
  approveAgent: async (agentId) => {
    const response = await API.put(`/admin/agents/approve/${agentId}`);
    return response.data;
  },
  rejectAgent: async (agentId) => {
    const response = await API.put(`/admin/agents/reject/${agentId}`);
    return response.data;
  },
};

// Agent endpoints
export const agentAPI = {
  getAssignedComplaints: async () => {
    const response = await API.get("/agent/complaints");
    return response.data;
  },
  getComplaintDetails: async (id) => {
    const response = await API.get(`/agent/complaints/${id}`);
    return response.data;
  },
  updateStatus: async (complaintId, status) => {
    const response = await API.put(`/agent/status/${complaintId}`, { status });
    return response.data;
  },
  getHistory: async () => {
    const response = await API.get("/agent/history");
    return response.data;
  },
};

// Message endpoints
export const messageAPI = {
  send: async (messageData) => {
    const response = await API.post("/messages", messageData);
    return response.data;
  },
  getByComplaint: async (complaintId) => {
    const response = await API.get(`/messages/${complaintId}`);
    return response.data;
  },
  markRead: async (complaintId) => {
    const response = await API.put(`/messages/read/${complaintId}`);
    return response.data;
  },
};

// Feedback endpoints
export const feedbackAPI = {
  submit: async (feedbackData) => {
    const response = await API.post("/feedback", feedbackData);
    return response.data;
  },
  getByComplaint: async (complaintId) => {
    const response = await API.get(`/feedback/${complaintId}`);
    return response.data;
  },
  getAll: async () => {
    const response = await API.get("/feedback");
    return response.data;
  },
};

export default API;
