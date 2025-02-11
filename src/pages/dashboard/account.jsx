import { useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Button,
    Input,
} from "@material-tailwind/react";
import { Switch } from "antd";
import { usersTableData } from "@/data";
import { PencilIcon, TrashIcon, CheckIcon, PlusIcon } from "@heroicons/react/24/solid";

export function Accounts() {
    const [users, setUsers] = useState(usersTableData);
    const [editIndex, setEditIndex] = useState(null);
    const [newUser, setNewUser] = useState({ name: "", email: "", job: ["", ""], online: false, date: new Date().toLocaleDateString() });

    const handleToggleStatus = (index) => {
        const updatedUsers = [...users];
        updatedUsers[index].online = !updatedUsers[index].online;
        setUsers(updatedUsers);
    };

    const handleDeleteUser = (index) => {
        setUsers(users.filter((_, i) => i !== index));
    };

    const handleAddUser = () => {
        if (newUser.name && newUser.email) {
            setUsers([...users, newUser]);
            setNewUser({ name: "", email: "", job: ["", ""], online: false, date: new Date().toLocaleDateString() });
        }
    };

    const handleEditUser = (index, field, value) => {
        const updatedUsers = [...users];
        updatedUsers[index][field] = value;
        setUsers(updatedUsers);
    };

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h6" color="white">
                        Quản lý tài khoản
                    </Typography>
                    <Button onClick={handleAddUser} className="flex items-center gap-2 bg-primaryColor hover:bg-primaryColor">
                        <PlusIcon className="w-4 h-4" /> Thêm tài khoản
                    </Button>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {["Thông tin tài khoản", "Vai trò", "Trạng thái", "Ngày tham gia", "Hành động"].map((el) => (
                                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(({ img, name, email, job, online, date }, index) => {
                                const className = `py-3 px-5 ${index === users.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                                return (
                                    <tr key={index}>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                <Avatar src={img} alt={name} size="sm" variant="rounded" />
                                                <div>
                                                    {editIndex === index ? (
                                                        <Input value={name} onChange={(e) => handleEditUser(index, "name", e.target.value)} />
                                                    ) : (
                                                        <Typography variant="small" color="blue-gray" className="font-semibold">
                                                            {name}
                                                        </Typography>
                                                    )}
                                                    {editIndex === index ? (
                                                        <Input value={email} onChange={(e) => handleEditUser(index, "email", e.target.value)} />
                                                    ) : (
                                                        <Typography className="text-xs font-normal text-blue-gray-500">
                                                            {email}
                                                        </Typography>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            {editIndex === index ? (
                                                <Input value={job[0]} onChange={(e) => handleEditUser(index, "job", [e.target.value, job[1]])} />
                                            ) : (
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {job[0]}
                                                </Typography>
                                            )}
                                        </td>
                                        <td className={className}>
                                            <Switch
                                                checked={online}
                                                onChange={() => handleToggleStatus(index)}
                                                checkedChildren="Hoạt động"
                                                unCheckedChildren="Ngừng"
                                                className="bg-gray-300"
                                            />
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {date}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            {editIndex === index ? (
                                                <button onClick={() => setEditIndex(null)} className="text-green-500 hover:text-green-700 transition">
                                                    <CheckIcon className="w-4 h-4" />
                                                </button>
                                            ) : (
                                                <button onClick={() => setEditIndex(index)} className="text-primaryColor hover:text-primaryColor transition">
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button onClick={() => handleDeleteUser(index)} className="text-red-500 hover:text-red-700 transition ml-2">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
        </div>
    );
}

export default Accounts;
