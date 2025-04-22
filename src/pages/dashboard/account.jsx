import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/network/api/authen";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  Paper,
  Switch,
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
import Avatar from "antd/es/avatar/Avatar";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

function Accounts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVerified, setFilterVerified] = useState("");

  const [filterPackage, setFilterPackage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [editingAccount, setEditingAccount] = useState(null);

  const { data, isLoading, error, refetch } = useGetUserQuery();
  const [createUser] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  if (isLoading) {
    return <CircularProgress />;
  }
  if (error) {
    return (
      <Typography color="error">Lỗi khi tải dữ liệu người dùng!</Typography>
    );
  }

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Hàm thay đổi giá trị của modal (cho cả create và edit)
  const handleInputChange = (e, setState, state) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  // Create new account
  const handleCreateAccount = async () => {
    try {
      await createUser(newAccount).unwrap();
      refetch();
      setOpenCreateModal(false);
      setNewAccount({ name: "", email: "", password: "", role: "admin" });
      toast.success("Tạo tài khoản thành công!");
    } catch (err) {
      console.error("Error creating user:", err);
      toast.error("Có lỗi xảy ra khi tạo tài khoản.");
    }
  };

  // Mở modal chỉnh sửa, truyền account cần chỉnh sửa
  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setOpenEditModal(true);
  };

  // Update account đã chỉnh sửa
  const handleUpdateAccount = async () => {
    try {
      await updateUser({ id: editingAccount._id, ...editingAccount }).unwrap();
      refetch();
      setOpenEditModal(false);
      setEditingAccount(null);
      toast.success("Cập nhật tài khoản thành công!");
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Có lỗi xảy ra khi cập nhật tài khoản.");
    }
  };

  // Hàm mở modal xác nhận xoá và lưu id tài khoản
  const handleOpenConfirm = (id) => {
    setSelectedAccountId(id);
    setOpenConfirm(true);
  };

  // Hàm đóng modal xác nhận xoá
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setSelectedAccountId(null);
  };

  const handleDeleteAccount = async () => {
    if (!selectedAccountId) return;

    try {
      await deleteUser(selectedAccountId).unwrap();
      refetch();
      toast.success("Xóa tài khoản thành công!");
      handleCloseConfirm(); // Đóng modal sau khi xóa
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Có lỗi xảy ra khi xóa tài khoản.");
    }
  };

  // Xử lý chuyển đổi trạng thái xác thực sử dụng API updateUser
  const handleToggleVerified = async (id, checked) => {
    try {
      await updateUser({ id, isVerified: checked }).unwrap();
      refetch();
      toast.success("Cập nhật trạng thái xác thực thành công!");
    } catch (err) {
      console.error("Error updating verification status:", err);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái xác thực.");
    }
  };

  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).slice(-2);
    }
    return color;
  };

  const CustomAvatar = ({ name }) => {
    const displayName = name || "U";
    const firstLetter = displayName.charAt(0).toUpperCase();
    const bgColor = stringToColor(displayName);
    const avatarStyle = {
      backgroundColor: bgColor,
      color: "#fff",
      width: 40,
      height: 40,
      fontSize: "20px",
    };
    return <Avatar style={avatarStyle}>{firstLetter}</Avatar>;
  };

  const filteredData = data?.filter((account) => {
    const matchNameOrEmail =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPackage =
      filterPackage === "" || account.package === filterPackage;

    const matchVerified =
      filterVerified === ""
        ? true
        : String(account.isVerified) === filterVerified;

    return matchNameOrEmail && matchVerified && matchesPackage;
  });

  return (
    <div style={{ padding: 10 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, color: "#0E7490" }}
      >
        Quản trị viên
      </Typography>
      {/* Filters and Actions */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          mt: 2,
          alignItems: "flex-end",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm tên tài khoản/ email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
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

        {/* Add Account Button */}
        <Button
          variant="contained"
          style={{
            backgroundColor: "#0E7490",
            color: "#ffffff",
            minWidth: 150,
            padding: "8px 16px",
            height: "100%",
            borderRadius: "8px",
          }}
          onClick={() => setOpenCreateModal(true)}
        >
          Thêm tài khoản
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: "8px" }}
      >
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#0E7490", color: "#fff" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                STT
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Ảnh đại diện
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Tên tài khoản
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Vai trò
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Ngày tham gia
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Gói đang sử dụng
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                Trạng thái
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
                .map((account, index) => (
                  <TableRow
                    key={account._id}
                    hover
                    sx={{ borderBottom: "1px solid #e0e0e0" }}
                  >
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <CustomAvatar name={account?.name} />
                    </TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>
                      {account.role === "admin"
                        ? "Người dùng"
                        : "Quản trị viên"}
                    </TableCell>
                    <TableCell>
                      {account.joinDate
                        ? new Date(account.joinDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {account.package === "premium" ? "VIP" : "Free"}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={account.isVerified}
                        onChange={(e) =>
                          handleToggleVerified(account._id, e.target.checked)
                        }
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEditAccount(account)}
                        sx={{ mr: 2 }}
                      >
                        <EditIcon style={{ color: "#0E7490" }} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenConfirm(account._id)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  align="center"
                  sx={{ padding: "16px", fontStyle: "italic" }}
                >
                  Không có dữ liệu người dùng
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal tạo tài khoản */}
      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Tạo tài khoản mới
          </Typography>
          <TextField
            label="Tên người dùng"
            variant="outlined"
            name="name"
            value={newAccount.name}
            onChange={(e) => handleInputChange(e, setNewAccount, newAccount)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            variant="outlined"
            name="email"
            value={newAccount.email}
            onChange={(e) => handleInputChange(e, setNewAccount, newAccount)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mật khẩu"
            variant="outlined"
            type="password"
            name="password"
            value={newAccount.password}
            onChange={(e) => handleInputChange(e, setNewAccount, newAccount)}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Vai trò"
            name="role"
            value={newAccount.role}
            onChange={(e) => handleInputChange(e, setNewAccount, newAccount)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="admin">Quản trị viên 1</MenuItem>
            <MenuItem value="user">Quản trị viên 2</MenuItem>
          </TextField>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => setOpenCreateModal(false)} sx={{ mr: 1 }}>
              Hủy
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#0E7490", color: "#ffffff" }}
              onClick={handleCreateAccount}
            >
              Tạo
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal cập nhật tài khoản */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Cập nhật tài khoản
          </Typography>
          {editingAccount && (
            <>
              <TextField
                label="Tên người dùng"
                variant="outlined"
                name="name"
                value={editingAccount.name}
                onChange={(e) =>
                  handleInputChange(e, setEditingAccount, editingAccount)
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                variant="outlined"
                name="email"
                value={editingAccount.email}
                onChange={(e) =>
                  handleInputChange(e, setEditingAccount, editingAccount)
                }
                fullWidth
                margin="normal"
              />
              <TextField
                select
                label="Vai trò"
                name="role"
                value={editingAccount.role}
                onChange={(e) =>
                  handleInputChange(e, setEditingAccount, editingAccount)
                }
                fullWidth
                margin="normal"
              >
                <MenuItem value="admin">Quản trị viên 1</MenuItem>
                <MenuItem value="user">Quản trị viên 2</MenuItem>
              </TextField>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={() => setOpenEditModal(false)} sx={{ mr: 1 }}>
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#0E7490", color: "#ffffff" }}
                  onClick={handleUpdateAccount}
                >
                  Cập nhật
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Xác nhận xoá</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa tài khoản này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} style={{ color: "#0E7490" }}>
            Hủy
          </Button>
          <Button onClick={handleDeleteAccount} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        labelRowsPerPage="Số dòng mỗi trang"
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Accounts;
