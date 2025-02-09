import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserData, fetchAllUsers, createUser, updateUser, deleteUser } from "../apis/userApi";

interface UserState {
    data: any | null;
    users: any[];
    loading: boolean;
    error: string | null;
    token: string | null;
}

const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;

const initialState: UserState = {
    data: storedUser ? JSON.parse(storedUser) : null,
    token: storedUser ? JSON.parse(storedUser).token : null,
    users: [],
    loading: false,
    error: null,
};


export const fetchUser = createAsyncThunk("users/fetchUser", async (_, { getState, rejectWithValue }) => {
    try {
        const state: any = getState();
        return await fetchUserData(state.user.token, state.user.data?.id || '');
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to fetch users data");
    }
});

export const fetchUsers = createAsyncThunk("user/fetchUsers", async (_, { getState, rejectWithValue }) => {
    try {
        const state: any = getState();
        const token = state.user.token;
        if (!token) throw new Error("No authentication token found");

        const response = await fetchAllUsers(token);
        console.log("✅ API Response for fetchUsers:", response);

        return response.data || [];
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to fetch users");
    }
});



export const addUser = createAsyncThunk("users/addUser", async ({ token, userData }: { token: string; userData: any }, { rejectWithValue }) => {
    try {
        return await createUser(token, userData);
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to create users");
    }
});

export const modifyUser = createAsyncThunk("users/modifyUser", async ({ token, userId, userData }: { token: string; userId: string; userData: any }, { rejectWithValue }) => {
    try {
        return await updateUser(token, userId, userData);
    } catch (error: any) {
        return rejectWithValue(error.message || "Failed to update users");
    }
});

export const removeUser = createAsyncThunk(
    "users/removeUser",
    async ({ token, userId }: { token: string; userId: string }, { rejectWithValue }) => {
        try {
            const response = await deleteUser(token, userId);

            if (!response.success) {
                return rejectWithValue(response.error?.message || "Failed to delete user");
            }

            return { userId };
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to delete user");
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ id: string; email: string; displayName: string; token: string }>) => {
            state.data = { id: action.payload.id, email: action.payload.email, displayName: action.payload.displayName };
            state.token = action.payload.token;
            state.error = null;
        },
        logout: (state) => {
            state.data = null;
            state.token = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === "string" ? action.payload : "An error occurred";
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            .addCase(modifyUser.fulfilled, (state, action) => {
                state.users = state.users.map((user) =>
                    user.id === action.payload.id ? action.payload : user
                );
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user.id !== action.meta.arg.userId);
            })
            .addCase(removeUser.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    }
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
