const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handleResponse = async (response: Response) => {
    const data = await response.json();

    if (!response.ok) {
        console.error(`❌ API Error (${response.status}):`, data);
        throw new Error(data.error?.message || "An error occurred");
    }

    return data;
};

export const loginUser = async (email: string, password: string) => {
    console.log(`🔹 Sending API request to: ${API_URL}/auth/login`);

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("❌ Login Request Failed:", error);
        throw error;
    }
};

export const fetchUserData = async (token: string, userId: string) => {
    console.log(`🔹 Fetching user data from: ${API_URL}/fetch-user-data/${userId}`);

    try {
        const response = await fetch(`${API_URL}/fetch-user-data/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("❌ Fetch User Request Failed:", error);
        throw error;
    }
};

export const fetchAllUsers = async (token: string) => {
    console.log(`🔹 Fetching all users from: ${API_URL}/fetch-all-users`);

    try {
        const response = await fetch(`${API_URL}/fetch-all-users`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("❌ Fetch All Users Failed:", error);
        throw error;
    }
};

export const createUser = async (token: string, userData: any) => {
    console.log(`🔹 Creating user at: ${API_URL}/create-user-data`);

    try {
        const response = await fetch(`${API_URL}/create-user-data`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(userData),
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("❌ Create User Failed:", error);
        throw error;
    }
};

export const updateUser = async (token: string, userId: string, userData: any) => {
    console.log(`🔹 Updating user at: ${API_URL}/update-user-data/${userId}`);

    try {
        const response = await fetch(`${API_URL}/update-user-data/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(userData),
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("❌ Update User Failed:", error);
        throw error;
    }
};

export const deleteUser = async (token: string, userId: string) => {
    console.log(`🔹 Deleting user at: ${API_URL}/delete-user-data/${userId}`);

    try {
        const response = await fetch(`${API_URL}/delete-user-data/${userId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        return await handleResponse(response);
    } catch (error) {
        console.error("❌ Delete User Failed:", error);
        throw error;
    }
};
