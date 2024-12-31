import { X } from "lucide-react"
import { useAuthStore } from "../store/useAtuthstore.js"
import { useChatStore } from "../store/useChatStore.js"

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="border-b w-full border-base-300 p-3">
      <div className="flex items-center w-full">
        <div className="flex items-center gap-3 w-fit">
          <div className="avatar">
            <div className="w-12 sm:w-18 rounded-full">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>
          <div>
            <div className="font-medium">{selectedUser.fullName}</div>
            <span className="text-base-content/70">
                {onlineUsers.includes(selectedUser._id) ? "online" : "offline"}
            </span>
          </div>
        </div>
        <button className="ms-auto" onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;