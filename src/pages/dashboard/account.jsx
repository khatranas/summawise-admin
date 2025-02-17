import { useMemo, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Button,
    Drawer,
} from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useGetUserQuery } from "@/network/api/authen";
import { axiosApi } from "@/network/api/api";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input } from "antd";

export function Accounts() {
    const { data = [] } = useGetUserQuery();
    const [openDrawer, setOpenDrawer] = useState(false);
    // const [openDrawerAdd, setOpenDrawerAdd] = useState(false);
    const { register, handleSubmit, setValue } = useForm();
    const firstUserId = data[0]?._id;

    const openEditDrawer = (user) => {
        setOpenDrawer(true);
        setValue("name", user.name);
        setValue("email", user.email);
        setValue("password", user.password)
        setValue("role", user.role)
    };

    // const {
    //     control,
    //     handleSubmit: handleSubmitAdd,
    //     formState: { errors },
    //     watch
    // } = useForm({
    //     defaultValues: {
    //         name: "",
    //         email: "",
    //         password: "",
    //         confirmPassword: ""
    //     }
    // });

    // const openAddDrawer = () => {
    //     setOpenDrawerAdd(true)
    // };

    // const handleAddAcc = async (data) => {
    //     if (data.password.length < 6) {
    //         toast.error("Mật khẩu phải có ít nhất 6 ký tự");
    //         return;
    //     }
    //     if (data.password !== data.confirmPassword) {
    //         toast.error("Mật khẩu nhập lại không khớp");
    //         return;
    //     }
    //     try {
    //         const payload = {
    //             name: data.name,
    //             email: data.email,
    //             password: data.password,
    //         };

    //         const response = await axiosApi.register(payload);
    //         console.log(response);

    //         toast.success("Đăng ký thành công!");
    //         setOpenDrawerAdd(false);
    //     } catch (error) {
    //         const errorMessage = error.response?.data?.message;
    //         toast.error(errorMessage ?? "Đăng ký thất bại, vui lòng thử lại.");
    //     }
    // };

    const handleUpdateAcc = async (formData) => {
        try {
            const response = await axiosApi.accountPost(firstUserId, formData);
            console.log("response", response);
            toast.success("Cập nhật thành công!");
            setOpenDrawer(false);
        } catch (error) {
            toast.error("Cập nhật thất bại, vui lòng thử lại!");
        }
    };


    const columns = useMemo(
        () => [
            {
                header: "Avatar",
                accessorKey: "avatar",
                cell: ({ getValue, row }) =>
                    getValue() ? (
                        <Avatar src={getValue()} alt={row.original.name} />
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mx-auto"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                            <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                            <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
                        </svg>
                    ),
            },
            {
                header: "Tên người dùng",
                accessorKey: "name",
            },
            {
                header: "Email",
                accessorKey: "email",
            },
            {
                header: "Xác thực",
                accessorKey: "isVerified",
                cell: ({ getValue }) => (getValue() ? "Có" : "Không"),
            },
            {
                header: "Ngày tham gia",
                accessorKey: "joinDate",
                cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
            },
            {
                header: "Vai trò",
                accessorKey: "role",
            },
            {
                header: "Cập nhật lần cuối",
                accessorKey: "updatedAt",
                cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
            },
            {
                header: "Chức năng",
                accessorKey: "actions",
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        <svg
                            onClick={() => openEditDrawer(row.original)}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            className="icon-tabler-edit"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                            <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                            <path d="M16 5l3 3" />
                        </svg>
                    </div>
                ),
            }
        ],
        []
    );

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader
                    variant="gradient"
                    color="gray"
                    className="mb-8 p-6 flex justify-between items-center"
                >
                    <Typography variant="h6" color="white">
                        Quản lý tài khoản
                    </Typography>
                    <Button onClick={() => openAddDrawer()} className="flex items-center gap-2 bg-primaryColor hover:bg-primaryColor">
                        <PlusIcon className="w-4 h-4" /> Thêm tài khoản
                    </Button>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="bg-gray-200">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="border border-gray-300 py-3 px-5 text-left text-[11px] font-bold uppercase text-blue-gray-400"
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="border border-gray-300">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="p-2 text-center">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="text-center p-4">
                                        Không có dữ liệu người dùng
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardBody>
            </Card>

            <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} placement="right">
                <div className="p-4 w-full">
                    <Typography variant="h6">CHỈNH SỬA TÀI KHOẢN</Typography>

                    <form onSubmit={handleSubmit(handleUpdateAcc)}>
                        <div className="mt-4">
                            <div className="mb-4">
                                <Typography variant="small">Tên người dùng</Typography>
                                <input
                                    {...register("name")}
                                    type="text"
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <Typography variant="small">Email</Typography>
                                <input
                                    {...register("email")}
                                    type="email"
                                    className="w-full border p-2 rounded"
                                />
                            </div>

                            <div className="mb-4">
                                <Typography variant="small">Mật khẩu</Typography>
                                <input
                                    {...register("password")}
                                    type="password"
                                    className="w-full border p-2 rounded"
                                    placeholder="Nhập mật khẩu mới"
                                />
                            </div>
                            <div className="mb-4">
                                <Typography variant="small">Vai trò</Typography>
                                <input
                                    {...register("role")}
                                    type="text"
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <Button className="bg-gray-400 w-auto px-4 py-2" onClick={() => setOpenDrawer(false)}>
                                    Hủy
                                </Button>
                                <Button type="submit" className="bg-primaryColor w-auto px-4 py-2">
                                    Lưu
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </Drawer>

            {/* Add Account Drawer */}
            {/* <Drawer open={openDrawerAdd} onClose={() => setOpenDrawerAdd(false)} placement="right">
                <div className="p-4 w-full">
                    <Typography variant="h6">THÊM TÀI KHOẢN</Typography>

                    <form onSubmit={handleSubmitAdd(handleAddAcc)}>
                        <div className="mt-4">
                            <div className="mb-4">
                                <div>
                                    <Typography.Text>Họ và tên</Typography.Text>
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{ required: "Vui lòng nhập họ và tên" }}
                                        render={({ field }) => (
                                            <Input {...field} size="large" placeholder="Nhập họ và tên ..." status={errors.name ? "error" : ""} />
                                        )}
                                    />
                                    {errors.name && <Typography.Text type="danger">{errors.name.message}</Typography.Text>}
                                </div>
                            </div>
                            <div>
                                <Typography.Text>Email</Typography.Text>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: "Vui lòng nhập email",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Email không hợp lệ"
                                        }
                                    }}
                                    render={({ field }) => (
                                        <Input {...field} size="large" type="email" placeholder="Nhập email ..." status={errors.email ? "error" : ""} />
                                    )}
                                />
                                {errors.email && <Typography.Text type="danger">{errors.email.message}</Typography.Text>}
                            </div>
                            <div>
                                <Typography.Text>Mật khẩu</Typography.Text>
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ required: "Vui lòng nhập mật khẩu", minLength: { value: 6, message: "Mật khẩu ít nhất 6 ký tự" } }}
                                    render={({ field }) => (
                                        <Input.Password {...field} size="large" placeholder="Nhập mật khẩu ..." status={errors.password ? "error" : ""} />
                                    )}
                                />
                                {errors.password && <Typography.Text type="danger">{errors.password.message}</Typography.Text>}
                            </div>
                            <div>
                                <Typography.Text>Nhập lại mật khẩu</Typography.Text>
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    rules={{
                                        required: "Vui lòng nhập lại mật khẩu",
                                        validate: (value) => value === watch("password") || "Mật khẩu không khớp"
                                    }}
                                    render={({ field }) => (
                                        <Input.Password {...field} size="large" placeholder="Nhập lại mật khẩu ..." status={errors.confirmPassword ? "error" : ""} />
                                    )}
                                />
                                {errors.confirmPassword && <Typography.Text type="danger">{errors.confirmPassword.message}</Typography.Text>}
                            </div>
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <Button className="bg-gray-400 w-auto px-4 py-2" onClick={() => setOpenDrawerAdd(false)}>
                                    Hủy
                                </Button>
                                <Button type="submit" className="bg-primaryColor w-auto px-4 py-2">
                                    Tạo
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </Drawer> */}
        </div>
    );
}

export default Accounts;
