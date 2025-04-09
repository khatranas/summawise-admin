import { useGetUserQuery, useUpdateUserMutation } from "@/network/api/authen";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
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
  return <Avatar style={avatarStyle}>{firstLetter}</Avatar>;
};

function AccountUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error, refetch } = useGetUserQuery();
  const [updateUser] = useUpdateUserMutation();
  const [verifiedStatus, setVerifiedStatus] = useState("");
  const [packageType, setPackageType] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
  // Handle the change of rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data?.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVerified =
      verifiedStatus === ""
        ? true
        : account.isVerified === (verifiedStatus === "true");

    const matchesPackage =
      packageType === "" ? true : account.package === packageType;

    return matchesSearch && matchesVerified && matchesPackage;
  });

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

  return (
    <div style={{ padding: 10 }}>
      <Typography variant="h4" gutterBottom className="text-primaryColor">
        Người dùng
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <TextField
          label="Tìm kiếm"
          placeholder="Tên hoặc email"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
        />

        <TextField
          select
          label="Trạng thái xác thực"
          value={verifiedStatus}
          onChange={(e) => setVerifiedStatus(e.target.value)}
          fullWidth
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="true">Đã xác thực</MenuItem>
          <MenuItem value="false">Chưa xác thực</MenuItem>
        </TextField>
        <TextField
          select
          label="Gói dịch vụ"
          value={packageType}
          onChange={(e) => setPackageType(e.target.value)}
          fullWidth
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="free">Miễn phí</MenuItem>
          <MenuItem value="premium">Premium</MenuItem>
        </TextField>
        <Button
          variant="contained"
          style={{ backgroundColor: "#0E7490", color: "#ffffff" }}
          onClick={() => {
            setSearchTerm("");
            setVerifiedStatus("");
            setPackageType("");
          }}
        >
          Xoá bộ lọc
        </Button>
      </div>

      <TableContainer component={Box} elevation={3}>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData && filteredData.length > 0 ? (
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((account, index) => (
                  <TableRow key={account._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <CustomAvatar name={account?.name} />
                    </TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>
                      {account.role === "admin"
                        ? "Quản trị viên"
                        : "Người dùng"}
                    </TableCell>
                    <TableCell>
                      {account.joinDate
                        ? new Date(account.joinDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {account.package === "free" ? "Miễn phí" : "Premium"}
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
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Không có dữ liệu người dùng
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
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

export default AccountUsers;
