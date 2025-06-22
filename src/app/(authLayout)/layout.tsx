import { ReactNode } from "react";
import { Toaster } from "sonner";


const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            {children}
            <Toaster position="top-center" richColors />
        </div>
    );
};

export default AuthLayout;