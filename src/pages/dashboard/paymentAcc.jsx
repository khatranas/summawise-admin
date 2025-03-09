import { axiosApi } from '@/network/api/api';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TextField, InputAdornment } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import SearchIcon from "@mui/icons-material/Search";

export const PaymentAcc = () => {
    const [paymentAcc, setPaymentAcc] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axiosApi.paymentGet();
            if (response && Array.isArray(response)) {
                setPaymentAcc(response);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Lỗi kết nối API.";
            toast.error(errorMessage);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredData = paymentAcc?.filter((paymentAcc) => {
        const lowerSearchTerm = searchTerm.toLowerCase();

        return (
            paymentAcc.orderId.toLowerCase().includes(lowerSearchTerm) ||
            paymentAcc.userId.toLowerCase().includes(lowerSearchTerm)
        );
    });

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h4" gutterBottom>
                Thanh toán
            </Typography>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, marginTop: 10 }}>
                <TextField
                    variant="outlined"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell>STT</TableCell>
                            <TableCell>Mã gói</TableCell>
                            <TableCell>Mã người đăng kí</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Số tiền</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Ngày hoàn thành</TableCell>
                            {/* <TableCell>Hành động</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData && filteredData.length > 0 ? (
                            filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order, index) => (
                                <TableRow key={order._id} hover>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell>{order.orderId}</TableCell>
                                    <TableCell>{order.userId}</TableCell>
                                    <TableCell>
                                        <span style={{ color: order.status === "completed" ? "green" : "orange" }}>
                                            {order.status === "completed" ? "Hoàn thành" : "Chờ xử lý"}
                                        </span>
                                    </TableCell>
                                    <TableCell>{order.amount.toLocaleString()} VND</TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>
                                        {order.completedAt ? new Date(order.completedAt).toLocaleString() : <span style={{ color: "red" }}>Chưa hoàn thành</span>}
                                    </TableCell>
                                    {/* <TableCell>
                                        <IconButton onClick={() => console.log("Sửa đơn hàng", order)}>
                                            <EditIcon color="primary" />
                                        </IconButton>
                                        <IconButton onClick={() => console.log("Xóa đơn hàng", order._id)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </TableCell> */}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    Không có đơn hàng nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={paymentAcc.length}
                rowsPerPage={rowsPerPage}
                page={page}
                labelRowsPerPage="Số dòng mỗi trang"
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};