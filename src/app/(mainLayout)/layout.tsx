import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import { ReactNode } from "react";


const MainLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
};

export default MainLayout;