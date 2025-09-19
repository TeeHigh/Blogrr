import { useMutation } from "@tanstack/react-query";
import { deleteAvatarApi } from "../../services/accountService";
import { useAvatarContext } from "../../contexts/AvatarContext";
import useAvatarUpload from "../useAvatarUpload";

const useDeleteAvatar = () => {
  const { setShowUploadOptions } = useAvatarContext();
  // const { setAvatar } = useAvatarUpload();

    const {mutate: deleteAvatar, isSuccess: isAvatarDeleted } = useMutation({
        mutationFn: (publicId: string) => deleteAvatarApi(publicId),
        onSuccess: () => {
            // console.log("Avatar deleted successfully");
            // setAvatar(null);
            setShowUploadOptions(false);
        },
        onError: (error) => {
            console.error("Error deleting avatar:", error);
            throw new Error("Error deleting avatar");
        },
    });

    return{
      deleteAvatar,
      isAvatarDeleted
    }
}

export default useDeleteAvatar;