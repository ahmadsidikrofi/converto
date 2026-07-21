"use client";;
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/contexts/AuthContext";
import { CircleUserRound, CreditCard, ReceiptText, Settings, LogOut } from "lucide-react";

const PROFILE_ITEMS = [
  { label: "My Profile", icon: CircleUserRound },
  // { label: "My Subscription", icon: CreditCard },
  // { label: "My Invoice", icon: ReceiptText },
];

const SETTINGS_ITEMS = [
  { label: "Pengaturan Akun", icon: Settings },
];

const LOGOUT_ITEM = {
  label: "Keluar",
  icon: LogOut,
  destructive: true,
};

const itemClass =
  "p-2 text-sm font-medium text-popover-foreground cursor-pointer gap-2";

const Dropdown = ({
  trigger,
  defaultOpen,
  align = "end"
}) => {
  const { user, userData, loading, logout } = useAuth()

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger className="cursor-pointer">
          {trigger}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={align}
          className="w-3xs rounded-2xl data-open:slide-in-from-bottom-20! data-closed:slide-out-to-bottom-20 data-open:fade-in-0 data-closed:fade-out-0 data-closed:zoom-out-100 duration-400">
          <DropdownMenuGroup>
            {/* User Info */}
            <DropdownMenuLabel className="flex items-center gap-3 px-4 py-3">
              <div className="relative">
                <Avatar className="size-10">
                  <AvatarImage
                    src={userData?.profilePicture || `https://ui-avatars.com/api/?name=${userData?.fullName?.slice(0, 2)}&background=random`}
                    alt={userData?.fullName || "User"} />
                  <AvatarFallback>{userData?.fullName?.slice(0, 2) || "DM"}</AvatarFallback>
                </Avatar>
                <span
                  className="ring-card absolute right-0 bottom-0 size-2 rounded-full bg-green-600 ring-2" />
              </div>

              <div className="flex flex-col">
                <span className="text-popover-foreground text-sm font-medium">
                  {user?.displayName?.length > 15 ? user?.displayName?.slice(0, 16) + "..." : user?.displayName}
                </span>
                <span className="text-muted-foreground text-sm">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Main Links */}
            {PROFILE_ITEMS.map(({ label, icon: Icon }) => (
              <DropdownMenuItem key={label} className={itemClass}>
                <Icon size={20} />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            {/* Settings */}
            <DropdownMenuGroup>
              {SETTINGS_ITEMS.map(({ label, icon: Icon }) => (
                <DropdownMenuItem key={label} className={itemClass}>
                  <Icon size={20} />
                  <span>{label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem variant="destructive" className={itemClass}>
              <LOGOUT_ITEM.icon size={20} />
              <span onClick={logout}>{LOGOUT_ITEM.label}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const DropdownMenuProfile = () => {
  return (
    <Dropdown
      align="center"
      trigger={
        <div className="rounded-full">
          <Avatar className="size-10 cursor-pointer">
            <AvatarImage
              src="https://images.shadcnspace.com/assets/profiles/user-11.jpg"
              alt="David McMichael" />
            <AvatarFallback>DM</AvatarFallback>
          </Avatar>
        </div>
      } />
  );
};

export default DropdownMenuProfile;
