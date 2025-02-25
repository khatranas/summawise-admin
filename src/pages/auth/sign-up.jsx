import { Button, Input, Typography } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import React from "react";
import Background from "../../assets/imgs/background_login.png";
import { axiosApi } from "@/network/api/api";
import { toast } from "react-toastify";

export function SignUp() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await axiosApi.register({
        name: data.name,
        email: data.email,
        password: data.password
      });

      toast.success("Đăng ký thành công!");
      navigate("/auth/login");
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage ?? "Đăng ký thất bại, vui lòng thử lại.");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center relative">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={Background} className="h-full w-full object-cover" alt="Background" />
        <div className="absolute inset-0 bg-white bg-opacity-20"></div>
      </div>

      {/* Form Container */}
      <div className="relative w-full max-w-xl p-28 bg-white rounded-xl shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h1 className="text-[40px] font-semibold text-gray-800 text-center">Đăng ký</h1>

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

          <Button className="w-full py-3 mt-5 bg-primaryColor text-white" htmlType="submit" type="primary">
            Đăng ký
          </Button>

          <div className="flex items-center justify-center text-center text-sm mt-6 font-semibold">
            <Typography.Text className="text-gray-800">Bạn đã có tài khoản?</Typography.Text>
            <Typography.Link className="ml-1" onClick={() => navigate("/auth/login")}>
              Đăng nhập ngay
            </Typography.Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
