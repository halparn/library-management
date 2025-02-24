import { Router } from 'express';
import { BookController } from '../controllers/bookController';
import { bookValidators, validate, sanitizeInputs } from '../middleware/validators';

const router = Router();
const bookController = new BookController();

// Apply sanitization middleware to all routes
router.use(sanitizeInputs);

router.get('/',
  validate(bookValidators.queryParams),
  bookController.getBooks
);

router.get('/:id',
  validate([bookValidators.bookId]),
  bookController.getBook
);


export default router; 