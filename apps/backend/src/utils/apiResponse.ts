export const successResponse = (message: string, data: any = {}) => ({
    success: true,
    message,
    data,
});

export const errorResponse = (message: string, code: number = 500) => ({
    success: false,
    error: { message, code },
});
