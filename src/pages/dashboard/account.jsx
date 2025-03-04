import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Modal,
  Typography,
  InputAdornment,
  Box,
  CircularProgress,
  Switch,
  IconButton,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUserQuery,
  useUpdateUserMutation
} from "@/network/api/authen";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Avatar from "antd/es/avatar/Avatar";

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
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
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
    return <Typography color="error">Lỗi khi tải dữ liệu người dùng!</Typography>;
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data?.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Delete account với xác nhận trước khi xóa
  const handleDeleteAccount = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      try {
        await deleteUser(id).unwrap();
        refetch();
        toast.success("Xóa tài khoản thành công!");
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error("Có lỗi xảy ra khi xóa tài khoản.");
      }
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
    const displayName = name || "U"; // Default to 'U' if no name is provided
    const firstLetter = displayName.charAt(0).toUpperCase(); // Get the first letter of the name
    const bgColor = stringToColor(displayName); // Generate the background color from the name

    // Using inline styles for better control of background color
    const avatarStyle = {
      backgroundColor: bgColor,
      color: "#fff", // Ensure the text is visible (white color)
      width: 40,
      height: 40,
      fontSize: "20px", // Make sure the letter is big enough
    };
    return (
      <Avatar style={avatarStyle}>
        {firstLetter}
      </Avatar>

    );
  };


  return (
    <div style={{ padding: 10 }}>
      <Typography variant="h4" gutterBottom>
        Tài khoản
      </Typography>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm tài khoản..."
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
        <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
          Thêm tài khoản
        </Button>
      </div>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>STT</TableCell>
              <TableCell>Ảnh đại diện</TableCell>
              <TableCell>Tên người dùng</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Ngày tham gia</TableCell>
              <TableCell>Gói đang sử dụng</TableCell>
              <TableCell>Xác thực</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData && filteredData.length > 0 ? (
              filteredData.map((account, index) => (
                <TableRow key={account._id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <CustomAvatar name={account?.name} />
                  </TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</TableCell>
                  <TableCell>
                    {account.joinDate ? new Date(account.joinDate).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    {account.package === "free" ? "Miễn phí" : "Premium"}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={account.isVerified}
                      onChange={(e) => handleToggleVerified(account._id, e.target.checked)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditAccount(account)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteAccount(account._id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
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
            <Button variant="contained" color="primary" onClick={handleCreateAccount}>
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
                onChange={(e) => handleInputChange(e, setEditingAccount, editingAccount)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                variant="outlined"
                name="email"
                value={editingAccount.email}
                onChange={(e) => handleInputChange(e, setEditingAccount, editingAccount)}
                fullWidth
                margin="normal"
              />
              <TextField
                select
                label="Vai trò"
                name="role"
                value={editingAccount.role}
                onChange={(e) => handleInputChange(e, setEditingAccount, editingAccount)}
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
                <Button variant="contained" color="primary" onClick={handleUpdateAccount}>
                  Cập nhật
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Accounts;
