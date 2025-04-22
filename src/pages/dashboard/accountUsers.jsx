import { useGetUserQuery, useUpdateUserMutation } from "@/network/api/authen";
import {
  Box,
  CircularProgress,
  InputAdornment,
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
import { SearchIcon } from "lucide-react";
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
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 600, color: "#0E7490" }}
      >
        Người dùng
      </Typography>
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
          placeholder="Tìm kiếm tên người dùng/ email"
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
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#0E7490", color: "#fff" }}>
              <TableCell sx={{ fontWeight: 600, color: "#fff" }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#fff" }}>
                Ảnh đại diện
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#fff" }}>
                Tên người dùng
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#fff" }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#fff" }}>
                Vai trò
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#fff" }}>
                Ngày tham gia
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#fff" }}>
                Gói dịch vụ
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#fff" }}>
                Trạng thái
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
                    sx={{
                      transition: "0.2s",
                      "&:hover": { backgroundColor: "#f9f9f9" },
                    }}
                  >
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Box display="flex" justifyContent="center">
                        <CustomAvatar name={account?.name} />
                      </Box>
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
                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
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
