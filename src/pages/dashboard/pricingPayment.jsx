import { axiosApi } from "@/network/api/api";
import {
  useCreatePricingMutation,
  useDeletePricingMutation,
  useUpdatePricingMutation,
} from "@/network/api/pricing";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export const PricingPayment = () => {
  const [paymentAcc, setPaymentAcc] = useState([]);
  const [deletePricing] = useDeletePricingMutation();
  const [createPricing] = useCreatePricingMutation();
  const [updatePricing] = useUpdatePricingMutation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editingPricing, setEditingPricing] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [newPricing, setNewPricing] = useState({
    name: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    getPricingPayment();
  }, []);

  const getPricingPayment = async () => {
    try {
      const response = await axiosApi.pricingGet();
      if (response && Array.isArray(response)) {
        setPaymentAcc(response);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi tải dữ liệu";
      toast.error(errorMessage);
    }
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = paymentAcc?.filter((paymentAcc) => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return (
      paymentAcc.name.toLowerCase().includes(lowerSearchTerm) ||
      paymentAcc._id.toLowerCase().includes(lowerSearchTerm)
    );
  });

  const handleOpenConfirm = (id) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setSelectedId(null);
  };

  const handleDeletePricingPayment = async () => {
    if (!selectedId) return;
    try {
      await deletePricing(selectedId).unwrap();
      toast.success("Xóa gói tài khoản thành công!");
      await getPricingPayment();
    } catch (err) {
      console.error("Error deleting pricing:", err);
      toast.error("Có lỗi xảy ra khi xóa gói tài khoản.");
    } finally {
      handleCloseConfirm();
    }
  };

  // Create new account
  const handleCreatePricingPayment = async () => {
    try {
      await createPricing(newPricing).unwrap();
      setOpenCreateModal(false);
      setNewPricing({ name: "", price: "", description: "" });
      toast.success("Tạo gói tài khoản thành công!");
      await getPricingPayment();
    } catch (err) {
      console.error("Error creating user:", err);
      toast.error("Có lỗi xảy ra khi tạo gói tài khoản.");
    }
  };

  const handleInputChange = (e, setState, state) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: name === "price" ? (value ? parseFloat(value) : "") : value,
    });
  };

  const handleEditPricingPayment = (pricing) => {
    setEditingPricing(pricing);
    setOpenEditModal(true);
  };

  const handleUpdatePricingPayment = async () => {
    try {
      await updatePricing({
        id: editingPricing._id,
        ...editingPricing,
      }).unwrap();
      setOpenEditModal(false);
      toast.success("Cập nhật gói tài khoản thành công!");
      await getPricingPayment();
      setEditingPricing(null);
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Có lỗi xảy ra khi cập nhật gói tài khoản.");
    }
  };

  return (
    <div style={{ padding: 10 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, color: "#0E7490" }}
      >
        Gói tài khoản
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Tìm kiếm..."
        value={searchTerm}
        size="small"
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon style={{ color: "#0E7490" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          width: "300px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0E7490",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0E7490",
          },
        }}
      />

      <TableContainer
        component={Paper}
        elevation={3}
        className="mt-5"
        sx={{
          borderRadius: 2,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#0E7490", color: "#fff" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                STT
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Mã gói
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Tên gói
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Giá
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Mô tả
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Ngày tạo
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Ngày cập nhật
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData && filteredData.length > 0 ? (
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((pricing, index) => (
                  <TableRow
                    key={pricing._id}
                    hover
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "#f9f9f9",
                      },
                      "&:hover": {
                        backgroundColor: "#e6f7ff", // Màu khi di chuột
                      },
                    }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{pricing._id}</TableCell>
                    <TableCell>{pricing.name}</TableCell>
                    <TableCell>{pricing.price.toLocaleString()} VND</TableCell>
                    <TableCell>{pricing.description}</TableCell>
                    <TableCell>
                      {new Date(pricing.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(pricing.updatedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEditPricingPayment(pricing)}
                        sx={{
                          color: "#0E7490",
                          "&:hover": { backgroundColor: "#e0f7fa" },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenConfirm(pricing._id)}
                        sx={{
                          color: "red",
                          "&:hover": { backgroundColor: "#ffe6e6" },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có gói nào.
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

      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Xác nhận xoá</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa gói tài khoản này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} style={{ color: "#0E7490" }}>
            Hủy
          </Button>
          <Button onClick={handleDeletePricingPayment} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tạo pricing */}
      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Thêm gói tài khoản
          </Typography>
          <TextField
            label="Tên gói"
            variant="outlined"
            name="name"
            value={newPricing.name}
            onChange={(e) => handleInputChange(e, setNewPricing, newPricing)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Giá"
            variant="outlined"
            name="price"
            type="number"
            value={newPricing.price}
            onChange={(e) => handleInputChange(e, setNewPricing, newPricing)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mô tả"
            variant="outlined"
            name="description"
            value={newPricing.description}
            onChange={(e) => handleInputChange(e, setNewPricing, newPricing)}
            fullWidth
            margin="normal"
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => setOpenCreateModal(false)} sx={{ mr: 1 }}>
              Hủy
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#0E7490", color: "#ffffff" }} // Custom primary color
              onClick={handleCreatePricingPayment}
            >
              Tạo
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* cập nhật pricing */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Cập nhật gói tài khoản
          </Typography>
          {editingPricing && (
            <>
              <TextField
                label="Tên gói"
                variant="outlined"
                name="name"
                value={editingPricing.name}
                onChange={(e) =>
                  handleInputChange(e, setEditingPricing, editingPricing)
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Giá"
                variant="outlined"
                name="price"
                type="number"
                value={editingPricing.price}
                onChange={(e) =>
                  handleInputChange(e, setEditingPricing, editingPricing)
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Mô tả"
                variant="outlined"
                name="description"
                value={editingPricing.description}
                onChange={(e) =>
                  handleInputChange(e, setEditingPricing, editingPricing)
                }
                fullWidth
                margin="normal"
              />
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={() => setOpenEditModal(false)} sx={{ mr: 1 }}>
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#0E7490", color: "#ffffff" }} // Custom primary color
                  onClick={handleUpdatePricingPayment}
                >
                  Cập nhật
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};
