'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, removeUser } from '@/store/userSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Box } from '@mui/material';
import UserForm from './UserForm';

const UserTable = () => {
    const dispatch = useDispatch();
    const { users = [], loading, token } = useSelector((state: any) => state.user);

    const [open, setOpen] = useState(false);
    const [editUser, setEditUser] = useState<any>(null);

    useEffect(() => {
        if (token) {
            dispatch(fetchUsers() as any);
        }
    }, [dispatch, token]);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!token) {
            setErrorMessage("Unauthorized action. Please log in.");
            return;
        }

        if (confirm("Are you sure you want to delete this user?")) {
            try {
                await dispatch(removeUser({ token, userId: id }) as any).unwrap();
                dispatch(fetchUsers() as any);
                setErrorMessage(null);
            } catch (error: any) {
                setErrorMessage(error);
            }
        }
    };

    const handleAddUser = () => {
        setEditUser(null);
        setOpen(true);
    };

    const handleEditUser = (user: any) => {
        setEditUser(user);
        setOpen(true);
    };

    return (
        <>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="contained" color="primary" onClick={handleAddUser}>
                    Add User
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="user table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : users.length > 0 ? (
                            users.map((user: any) => (
                                <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell align="right">
                                        {/* ✅ Ensures buttons are inside a flex container */}
                                        <Box display="flex" gap={1} justifyContent="flex-end">
                                            <Button
                                                onClick={() => handleEditUser(user)}
                                                color="primary"
                                                variant="contained"
                                                size="small"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(user.id)}
                                                color="error"
                                                variant="contained"
                                                size="small"
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No users found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {errorMessage && (
                <Box my={2} p={2} bgcolor="error.main" color="white" borderRadius={1} textAlign="center">
                    {errorMessage}
                </Box>
            )}

            {/* User Form Modal (For Add/Edit) */}
            <UserForm open={open} handleClose={() => setOpen(false)} editUser={editUser} />
        </>
    );
};

export default UserTable;
