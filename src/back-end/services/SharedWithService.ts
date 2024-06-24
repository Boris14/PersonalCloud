import SharedWith from '../models/SharedWith.js';
import SharedWithData from '../interfaces/SharedWithData.js';
import File from '../models/File.js';
import User from '../models/User.js';

class SharedWithService {
    static async shareFolder(shareData: SharedWithData): Promise<SharedWith | null> {
        try {
            const folder = await File.findByPk(shareData.folder_id);
            if (folder == null || folder.is_folder === false) {
                console.error('Bad request: Invalid folder id');
                return null;
            }

            const user = await User.findByPk(shareData.shared_to_user_id);
            if (user === null || user.id === folder.owner_id) {
                console.error('Bad request: Invalid user id');
                return null;
            }

            const sharedFile = await SharedWith.create(
                { 
                    folder_id: shareData.folder_id,
                    shared_to_user_id: shareData.shared_to_user_id,
                    permission_level: shareData.permission_level, 
                });
            return sharedFile;
        } catch (error) {
            console.error('Error sharing file:', error);
            return null;
        }
    }

    static async stopSharing(shareId: string): Promise<boolean> {
        try {

            const share = await SharedWith.findByPk(shareId);
            if (share) {
                await share.destroy();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error stopping sharing:', error);
            return false;
        }
    }
};

export default SharedWithService;
