import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { Switch } from "antd";
import { usersTableData } from "@/data";
import { PencilIcon, CheckIcon } from "@heroicons/react/24/solid";

export function Tables() {
  const [editMode, setEditMode] = useState(null);
  const [users, setUsers] = useState(usersTableData);

  const handleToggleStatus = (index) => {
    const updatedUsers = [...users];
    updatedUsers[index].online = !updatedUsers[index].online;
    setUsers(updatedUsers);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Quản lý người dùng
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Thông tin người dùng", "Cấp bậc", "Trạng thái", "Ngày tham gia", "Thao tác"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
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
                  <tr key={name}>
                    {/* Thông tin người dùng */}
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Avatar src={img} alt={name} size="sm" variant="rounded" />
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-semibold">
                            {name}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {email}
                          </Typography>
                        </div>
                      </div>
                    </td>

                    {/* Cấp bậc */}
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {job[0]}
                      </Typography>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {job[1]}
                      </Typography>
                    </td>

                    {/* Trạng thái */}
                    <td className={className}>
                      {editMode === index ? (
                        <Switch
                          checked={online}
                          onChange={() => handleToggleStatus(index)}
                          checkedChildren="Hoạt động"
                          unCheckedChildren="Ngừng"
                          className="bg-gray-300"
                        />
                      ) : (
                        <Typography className={`text-xs font-semibold ${online ? "text-green-600" : "text-red-500"}`}>
                          {online ? "Hoạt động" : "Ngừng"}
                        </Typography>
                      )}
                    </td>

                    {/* Ngày tham gia */}
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {date}
                      </Typography>
                    </td>

                    {/* Thao tác */}
                    <td className={className}>
                      <button
                        onClick={() => setEditMode(editMode === index ? null : index)}
                        className="flex items-center gap-1 text-blue-gray-600 hover:text-blue-800 transition"
                      >
                        {editMode === index ? (
                          <>
                            <span>Lưu</span>
                            <CheckIcon className="w-4 h-4 text-primaryColor" />
                          </>
                        ) : (
                          <>
                            <span>Chỉnh sửa</span>
                            <PencilIcon className="w-4 h-4" />
                          </>
                        )}
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

export default Tables;
