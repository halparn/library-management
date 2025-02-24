import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { ValidationError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';
import { invalidateBookCache } from '../utils/cache';

const prisma = new PrismaClient();

export class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { search } = req.query;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const where: Prisma.UserWhereInput = {
        ...(search ? {
          name: {
            contains: String(search).trim(),
            mode: Prisma.QueryMode.insensitive
          }
        } : {})
      };
  

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            name: 'asc',
          },
        }),
        prisma.user.count()
      ]);

      res.json({
        data: users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Error in getUsers:', error);
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        throw new ValidationError('Invalid user ID', {
          field: 'userId',
          value: req.params.userId
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          currentBooks: {
            select: {
              id: true,
              name: true,
              author: true,
              borrowHistory: {
                where: { userId },
                orderBy: { borrowedAt: 'desc' },
                take: 1,
                select: {
                  borrowedAt: true
                }
              }
            }
          },
          borrowHistory: {
            where: {
              returnedAt: { not: null }
            },
            orderBy: { borrowedAt: 'desc' },
            include: {
              book: {
                select: {
                  id: true,
                  name: true,
                  author: true
                }
              }
            }
          }
        }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      const response = {
        id: user.id,
        name: user.name,
        books: {
          present: user.currentBooks.map(book => ({
            id: book.id,
            name: book.name,
            author: book.author,
            borrowedAt: book.borrowHistory[0]?.borrowedAt
          })),
          past: user.borrowHistory.map(history => ({
            id: history.book.id,
            name: history.book.name,
            author: history.book.author,
            borrowedAt: history.borrowedAt,
            returnedAt: history.returnedAt,
            userScore: history.score
          }))
        }
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async borrowBook(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.userId);
      const bookId = Number(req.params.bookId);

      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const user = await tx.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new NotFoundError('User not found');
        }

        const book = await tx.book.findUnique({
          where: { id: bookId },
        });

        if (!book) {
          throw new NotFoundError('Book not found');
        }

        if (book.userId) {
          throw new ValidationError('Book is already borrowed', {
            field: 'bookId',
            value: bookId
          });
        }

        // update book status to borrowed
        await tx.book.update({
          where: { id: bookId },
          data: { userId: userId },
        });

        // create borrow history record
        await tx.borrowHistory.create({
          data: {
            userId: userId,
            bookId: bookId,
            borrowedAt: new Date(),
          },
        });
      });

      invalidateBookCache(bookId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async returnBook(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.userId);
      const bookId = Number(req.params.bookId);
      const score = Number(req.body.score);

      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {

        const book = await tx.book.findUnique({
          where: { id: bookId },
        });

        if (!book || book.userId !== userId) {
          throw new ValidationError('Book is not borrowed by this user', {
            field: 'bookId',
            value: bookId
          });
        }

        const borrowHistory = await tx.borrowHistory.findFirst({
          where: {
            userId: userId,
            bookId: bookId,
            returnedAt: null,
          },
        });

        if (!borrowHistory) {
          throw new NotFoundError('No active borrow record found');
        }

        // update book status to available
        await tx.book.update({
          where: { id: bookId },
          data: { userId: null },
        });

        // update borrow history with return date and score
        await tx.borrowHistory.update({
          where: { id: borrowHistory.id },
          data: {
            returnedAt: new Date(),
            score: score,
          },
        });
      });

      invalidateBookCache(bookId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
} 