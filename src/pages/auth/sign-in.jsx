import { Button, Input, Typography } from "antd";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import React from "react";

export function SignIn() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data) => {
    // Xử lý đăng nhập tại đây
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full h-full flex">
        {/* Hình ảnh */}
        <div className="w-1/2 h-full hidden lg:block">
          <img src="/img/pattern.png" className="h-full w-full object-cover" alt="Background" />
        </div>
        {/* Form đăng nhập */}
        <div className="w-1/2 p-16 flex flex-col items-center justify-center">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-2/3 mx-auto">
            <Typography.Title level={2} className="text-center text-gray-800">Đăng nhập</Typography.Title>
            <div>
              <Typography.Text>Email</Typography.Text>
              <Input size="large" placeholder="Nhập email của bạn ..." />
            </div>
            <div>
              <Typography.Text>Mật khẩu</Typography.Text>
              <Input.Password size="large" placeholder="Nhập mật khẩu của bạn ..." />
            </div>
            <Button className="w-full py-3 mt-5 bg-primaryColor text-white" htmlType="submit">
              Đăng nhập
            </Button>
            <div className="text-right text-sm font-bold text-gray-800">
              <a href="#">Quên mật khẩu?</a>
            </div>
            <div className="flex items-center justify-center text-center text-sm mt-6 font-semibold">
              <Typography.Text className="text-gray-800">Bạn chưa có tài khoản?</Typography.Text>
              <Typography.Link className="ml-1" onClick={() => navigate("/auth/Dang-ky")}>Đăng ký ngay</Typography.Link>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
}

export default SignIn;
