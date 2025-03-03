import PropTypes from "prop-types";
import { Typography } from "antd";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <Typography.Text className="font-normal text-inherit">
          Bản quyền thuộc &copy; Summawise {year}
        </Typography.Text>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  brandName: "Summawise AI Learning",
  brandLink: "http://localhost:5174/dashboard/thong-ke",
  routes: [
    { name: "Hướng dẫn", path: "/huong-dan" },
    { name: "Blog AI", path: "/blog-ai" },
    { name: "Điều khoản sử dụng", path: "/dieu-khoan" },
    { name: "Liên hệ", path: "/lien-he" },
  ],
};

Footer.propTypes = {
  brandName: PropTypes.string,
  brandLink: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
