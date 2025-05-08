import { IconLogout2 } from "@tabler/icons-react";
import { signOut } from "next-auth/react";

const SingOutButton = () => {
  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: "/signin",
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <div
      onClick={handleSignOut}
      className="flex items-center gap-2 justify-center"
    >
      <IconLogout2 />
      Logout
    </div>
  );
};

export default SingOutButton;
