import PropTypes from "prop-types";
import { Typography } from "antd";
import { HeartFilled } from "@ant-design/icons";

export function Footer({ brandName, brandLink, routes }) {
  const year = new Date().getFullYear();

  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <Typography.Text className="font-normal text-inherit">
          &copy; {year}, phát triển với{" "}
          <HeartFilled className="text-red-600" /> bởi{" "}
          <a
            href={brandLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold transition-colors hover:text-primaryColor"
          >
            {brandName}
          </a>{" "}
          - Học cùng AI, nâng tầm tri thức.
        </Typography.Text>
        <ul className="flex items-center gap-4">
          {routes.map(({ name, path }) => (
            <li key={name}>
              <Typography.Text>
                <a
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-primaryColor"
                >
                  {name}
                </a>
              </Typography.Text>
            </li>
          ))}
        </ul>
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
