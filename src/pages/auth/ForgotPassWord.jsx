// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useForm, Controller } from "react-hook-form";
// import { axiosApi } from "@/network/api/api";
// import Poster from "../../assets/imgs/poster.png";
// import { Input, Typography } from "@material-tailwind/react";
// import { Button } from "antd";

// export default function ForgotPassWord() {
//   const navigate = useNavigate();

//   const {
//     control,
//     handleSubmit,
//     formState: { errors }
//   } = useForm({
//     defaultValues: {
//       email: "",
//       name: ""
//     }
//   });

//   const onSubmit = async (data) => {
//     try {
//       const response = await axiosApi.forgotPassword({
//         email: data.email,
//         name: data.name
//       });
//       console.log("response", response);
//       toast.success("Mật khẩu mới đã được gửi đến email thành công");
//       navigate("auth/login");
//     } catch (error) {
//       const errorMessage = error.response?.data?.message;
//       toast.error(errorMessage ?? "Gửi mật khẩu mới thất bại");
//     }
//   };

//   return (
//     <div className="w-full h-screen flex items-center justify-center">
//       <div className="w-full h-full flex">
//         {/* Hình ảnh */}
//         <div className="w-1/2 h-full hidden lg:block">
//           <img src={Poster} className="h-full w-full object-cover" alt="Background" />
//         </div>
//         {/* Form quên mật khẩu */}
//         <div className="w-1/2 p-16 flex flex-col items-center justify-center">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-2/3 mx-auto">
//             <h1 className="text-[40px] font-semibold text-gray-800 text-center">Quên mật khẩu</h1>

//             {/* Tên tài khoản */}
//             <div>
//               <Typography.Text>Tên tài khoản</Typography.Text>
//               <Controller
//                 name="name"
//                 control={control}
//                 rules={{ required: "Tên tài khoản là bắt buộc" }}
//                 render={({ field }) => (
//                   <Input size="large" placeholder="Nhập tên tài khoản" {...field} />
//                 )}
//               />
//               {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
//             </div>

//             {/* Email */}
//             <div>
//               <Typography.Text>Email</Typography.Text>
//               <Controller
//                 name="email"
//                 control={control}
//                 rules={{
//                   required: "Email là bắt buộc",
//                   pattern: {
//                     value: /\S+@\S+\.\S+/,
//                     message: "Email không hợp lệ"
//                   }
//                 }}
//                 render={({ field }) => (
//                   <Input size="large" placeholder="Nhập email" {...field} />
//                 )}
//               />
//               {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//             </div>

//             {/* Nút gửi yêu cầu */}
//             <Button className="w-full py-3 mt-5 bg-primaryColor text-white" htmlType="submit">
//               Quên mật khẩu
//             </Button>

//             {/* Điều hướng về trang đăng nhập */}
//             <div className="flex items-center justify-center text-center text-sm mt-6 font-semibold">
//               <Typography.Text className="text-gray-800">Bạn đã có tài khoản?</Typography.Text>
//               <Typography.Link className="ml-1" onClick={() => navigate("/auth/login")}>
//                 Đăng nhập ngay
//               </Typography.Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
