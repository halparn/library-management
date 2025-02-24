import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { userValidators, validate, sanitizeInputs } from '../middleware/validators';

const router = Router();
const userController = new UserController();

// Apply sanitization middleware to all routes
router.use(sanitizeInputs);

router.get('/', validate(userValidators.queryParams), userController.getUsers);

router.get('/:userId',
  validate([userValidators.userId]),
  userController.getUser
);

router.post('/:userId/borrow/:bookId',
  validate([
    userValidators.userId,
    userValidators.bookId
  ]),
  userController.borrowBook
);

router.post('/:userId/return/:bookId',
  validate([
    userValidators.userId,
    userValidators.bookId,
    userValidators.score
  ]),
  userController.returnBook
);

export default router; 