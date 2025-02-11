import React from "react";
import { cn } from "../../utils";
import Ripple from "react-ripplejs";

const Button = ({
  type = "button",
  className,
  disabled,
  children,
  onClick,
  style,
}) => {
  const handleOnclick = () => {
    if (disabled) return;
    if (onClick) onClick();
  };

  return (
    <Ripple
      onClick={handleOnclick}
      className={cn(
        "w-full bg-primaryColor rounded-md py-2 px-3 cursor-pointer select-none border border-transparent text-white",
        className,
        {
          "cursor-not-allowed opacity-30": disabled,
        }
      )}
      style={style}
    >
      <button
        onClick={handleOnclick}
        type={type}
        className="m-0 p-0 line-clamp-1 size-full"
        style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
      >
        {children}
      </button>
    </Ripple>
  );
};

export default Button;
