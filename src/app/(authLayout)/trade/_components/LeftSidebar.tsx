import { cn } from "@/utils/utils";
import { BarChart3, LifeBuoy, ListChecks, ListFilter, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function SidebarItem({
  icon,
  label,
  active = false,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <div className="relative flex w-full flex-col items-center py-4 cursor-pointer hover:bg-gray-800/50 transition-colors">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-md",
          active ? "text-blue-400" : "text-gray-400 hover:text-gray-300"
        )}
      >
        {icon}
        {badge && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs">
            {badge}
          </span>
        )}
      </div>
      <span className="mt-1 text-[10px] font-medium">{label}</span>
      {active && (
        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
      )}
    </div>
  );
}

const LeftSidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="flex w-[60px] flex-col items-center border-r border-gray-800 bg-[#1A1D27]">
      <div className="flex w-full flex-col items-center">
        <Link href="/">
          <SidebarItem
            icon={<BarChart3 size={24} />}
            label="TRADE"
            active={pathname === "/"}
          />
        </Link>
        <Link href="/transaction-history">
          {" "}
          {/* Transaction History Link */}
          <SidebarItem
            icon={<ListChecks size={24} />}
            label="HISTORY"
            active={pathname === "/transaction-history"}
          />
        </Link>
        <Link href="/trades-history">
          <SidebarItem
            icon={<ListFilter size={24} />}
            label="TRADES"
            active={pathname === "/trades-history"}
          />
        </Link>
        <Link href="/support">
          <SidebarItem
            icon={<LifeBuoy size={24} />}
            label="SUPPORT"
            active={pathname === "/support"}
          />
        </Link>
        <Link href="/account">
          <SidebarItem
            icon={<User size={24} />}
            label="ACCOUNT"
            active={pathname === "/account"}
          />
        </Link>
        {/* <SidebarItem
          icon={<Trophy size={24} />}
          label="TOURNAMENTS"
          badge="4"
        /> */}
      </div>
      {/* <div className="mt-auto mb-4 flex flex-col items-center space-y-3 py-2">
        {socialMediaItems.length > 0 &&
          socialMediaItems.map((item) => {
            const IconComponent = getIconComponentByName(item.iconName);
            if (!IconComponent) {
              console.warn(`Icon not found for ${item.iconName}`);
              return null;
            }
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title={item.name}
                aria-label={item.name}
                className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
              >
                <IconComponent size={20} />
              </a>
            );
          })}
      </div> */}
    </aside>
  );
};

export default LeftSidebar;
