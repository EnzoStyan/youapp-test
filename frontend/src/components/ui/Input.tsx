import React from 'react';

// Menerima semua props standar dari sebuah input HTML
type InputProps = React.HTMLProps<HTMLInputElement>;

// Menggunakan forwardRef agar bisa diintegrasikan dengan form library nanti
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={`w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';
export { Input };