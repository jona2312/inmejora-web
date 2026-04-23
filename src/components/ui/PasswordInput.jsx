import React, { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PasswordInput = forwardRef(({ className, leftIcon: LeftIcon, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full flex items-center">
      {LeftIcon && (
        <LeftIcon className="absolute left-3 h-5 w-5 text-gray-500 z-10 pointer-events-none" />
      )}
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("w-full pr-10", LeftIcon ? "pl-10" : "", className)}
        ref={ref}
        {...props}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none flex items-center justify-center z-10"
        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };