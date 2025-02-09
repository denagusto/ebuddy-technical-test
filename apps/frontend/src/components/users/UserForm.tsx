import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, modifyUser, fetchUsers } from '@/store/userSlice';

const formatDate = (date: Dayjs | null) => date ? date.format("Do MMM, YYYY") : "";

const UserForm = ({ open, handleClose, editUser }: { open: boolean, handleClose: () => void, editUser?: any }) => {
    const dispatch = useDispatch();
    const token = useSelector((state: any) => state.user.token);

    const [form, setForm] = useState({
        name: '',
        email: '',
        totalAverageWeightRatings: '',
        numberOfRents: '',
        recentlyActive: null as Dayjs | null
    });

    useEffect(() => {
        if (editUser) {
            setForm({
                name: editUser.name || '',
                email: editUser.email || '',
                totalAverageWeightRatings: editUser.totalAverageWeightRatings || '',
                numberOfRents: editUser.numberOfRents || '',
                recentlyActive: editUser.recentlyActive
                    ? dayjs(editUser.recentlyActive)
                    : null
            });
        } else {
            setForm({
                name: '',
                email: '',
                totalAverageWeightRatings: '',
                numberOfRents: '',
                recentlyActive: null
            });
        }
    }, [editUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!token) {
            alert("Unauthorized action. Please log in.");
            return;
        }

        const formattedData = {
            ...form,
            totalAverageWeightRatings: parseFloat(form.totalAverageWeightRatings),
            numberOfRents: parseInt(form.numberOfRents, 10),
            recentlyActive: form.recentlyActive
                ? form.recentlyActive.valueOf()
                : null
        };

        if (editUser) {
            await dispatch(modifyUser({ token, userId: editUser.id, userData: formattedData }) as any);
        } else {
            await dispatch(addUser({ token, userData: formattedData }) as any);
        }

        dispatch(fetchUsers() as any);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{editUser ? "Edit User" : "Create User"}</DialogTitle>
            <DialogContent sx={{ width: 500, mx: "auto" }}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField name="name" label="Name" fullWidth value={form.name} onChange={handleChange} />
                    <TextField name="email" label="Email" fullWidth value={form.email} onChange={handleChange} />
                    <TextField name="totalAverageWeightRatings" label="Total Average Ratings" type="number" fullWidth value={form.totalAverageWeightRatings} onChange={handleChange} />
                    <TextField name="numberOfRents" label="Number of Rents" type="number" fullWidth value={form.numberOfRents} onChange={handleChange} />

                    {/* ✅ MUI Date Picker with Custom Format */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Recently Active"
                            value={form.recentlyActive}
                            onChange={(newValue: any) => setForm({ ...form, recentlyActive: newValue })}
                            format="Do MMM, YYYY"
                            slotProps={{ textField: { fullWidth: true } }}
                        />
                    </LocalizationProvider>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} color="primary">{editUser ? "Update" : "Create"}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserForm;
