'use client';

import React, { useState } from 'react';
import UserTable from '@/components/users/UserTable';
import UserForm from '@/components/users/UserForm';
import { Button } from '@mui/material';

const UserPage = () => {

    return (
        <div>
            <h1>Users</h1>
            <UserTable />
        </div>
    );
};

export default UserPage;
