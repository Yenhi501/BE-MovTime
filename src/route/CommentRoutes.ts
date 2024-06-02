import BaseRoutes from './Base/BaseRouter';
import { CommentController } from '../controller/CommentController';
import { auth } from '../middleware/AuthMiddleware';
import { validateAddComment, validateAddSubComment, validateDeleteComment, validateDeleteSubComment, validateUpdateComment, validateUpdateSubComment } from '../validators/CommentValidator';
import { validate } from '../validators/Validator';
class CommentRoutes extends BaseRoutes {
	constructor() {
		super(new CommentController());
	}
	public routes(): void {
		this.router.post('/create',auth, validateAddComment, validate, this.controller.addComment);
		this.router.delete('/delete/:commentId', auth, validateDeleteComment, validate, this.controller.deleteComment);
		this.router.put('/edit/:commentId', auth, validateUpdateComment, validate, this.controller.updateComment);
		this.router.post('/sub-comments/create',auth, validateAddSubComment, validate, this.controller.addSubComment);
		this.router.delete('/sub-comments/delete/:subCommentId', auth, validateDeleteSubComment, validate, this.controller.deleteSubComment);
		this.router.put('/sub-comments/edit/:subCommentId', auth, validateUpdateSubComment, validate, this.controller.updateSubComment);
	}
}

export default new CommentRoutes().router;
