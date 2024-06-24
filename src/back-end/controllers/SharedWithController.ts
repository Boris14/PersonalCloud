import { Request, Response } from 'express';
import SharedWithService from '../services/SharedWithService.js';

class SharedWithController {

    static async share(req: Request, res: Response) {
        try {
            const result = await SharedWithService.shareFolder(req.body);
            if(result != null) {
                res.status(201).json(result);
            }
            else {
                res.status(400).json({ error: "Couldn't share folder" });
            }
        } catch (error) {
            console.error('Error share file:', error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async stopSharing(req: Request, res: Response) {
        try {
            const shareId = req.params.shareId;
            const result = await SharedWithService.stopSharing(shareId);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: "Couldn't stop sharing folder" });
            }
        } catch (error) {
            console.error('Error when unsharing folder:', error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export default SharedWithController;