import { Button, Input, Typography } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Poster from "../../assets/imgs/poster.png";
import React from "react";
import { axiosApi } from "@/network/api/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export function SignIn() {
  const navigate = useNavigate();

  // Khởi tạo form với react-hook-form
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
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full h-full flex">
        <div className="w-1/2 h-full hidden lg:block">
          <img src={Poster} className="h-full w-full object-cover" alt="Background" />
        </div>
        <div className="w-1/2 p-16 flex flex-col items-center justify-center">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-2/3 mx-auto">
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
            <div className="flex items-center justify-center text-center text-sm mt-6 font-semibold">
              <Typography.Text className="text-gray-800">Bạn chưa có tài khoản?</Typography.Text>
              <Typography.Link className="ml-1" onClick={() => navigate("/auth/sign-up")}>
                Đăng ký ngay
              </Typography.Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
