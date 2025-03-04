import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export function Button({ className = "", ...props }: ButtonProps) {
  return <button className={`bg-gray-500 text-white px-2 py-2 rounded ${className}`} {...props} />;
}
