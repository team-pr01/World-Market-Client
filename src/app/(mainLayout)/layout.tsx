import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import { ReactNode } from "react";


const MainLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    );
};

export default MainLayout;