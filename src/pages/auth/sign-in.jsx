import { Button, Input, Typography } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Background from "../../assets/imgs/background_login.png";
import React from "react";
import { axiosApi } from "@/network/api/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export function SignIn() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Xử lý sự kiện submit form
  const onSubmit = async (data) => {
    try {
      const response = await axiosApi.login({
        email: data.email,
        password: data.password
      });
      Cookies.set("accessToken", response.data.access_token, { path: "/" });
      toast.success("Đăng nhập thành công");
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage ?? "Đăng nhập thất bại");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center relative">
      <div className="absolute inset-0">
        <img src={Background} className="h-full w-full object-cover" alt="Background" />
        <div className="absolute inset-0 bg-white bg-opacity-20"></div>
      </div>

      <div className="relative w-full max-w-xl p-28 bg-white rounded-xl shadow-lg ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h1 className="text-[40px] font-semibold text-gray-800 text-center">Đăng nhập</h1>
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
                <Input
                  {...field}
                  type="email"
                  size="large"
                  placeholder="Nhập email của bạn ..."
                  status={errors.email ? "error" : ""}
                />
              )}
            />
            {errors.email && (
              <Typography.Text type="danger">{errors.email.message}</Typography.Text>
            )}
          </div>
          <div>
            <Typography.Text>Mật khẩu</Typography.Text>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Vui lòng nhập mật khẩu" }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  size="large"
                  placeholder="Nhập mật khẩu của bạn ..."
                  status={errors.password ? "error" : ""}
                />
              )}
            />
            {errors.password && (
              <Typography.Text type="danger">{errors.password.message}</Typography.Text>
            )}
          </div>
          <Button
            className="w-full py-3 mt-3 bg-primaryColor text-white"
            htmlType="submit"
            type="primary"
          >
            Đăng nhập
          </Button>

          <div className="text-right text-sm font-bold text-gray-800">
            <a onClick={() => navigate("/forgot-password")}>Quên mật khẩu?</a>
          </div>
        </form>
      </div>
    </div>

  );
}

export default SignIn;
