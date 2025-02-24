import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { ValidationError, NotFoundError } from '../utils/errors';
import { cache } from '../utils/cache';

const prisma = new PrismaClient();


export class BookController {
  async getBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, available } = req.query;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const availableFilter = available as boolean | undefined;

      const where: Prisma.BookWhereInput = {
        AND: [
          search ? {
            OR: [
              { name: { contains: String(search).trim(), mode: Prisma.QueryMode.insensitive } },
              { author: { contains: String(search).trim(), mode: Prisma.QueryMode.insensitive } }
            ]
          } : {},
          availableFilter ? {
            userId: null
          } : {}
        ]
      };

      const [books, total] = await Promise.all([
        prisma.book.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            author: true,
            userId: true
          },
          orderBy: {
            name: 'asc',
          },
        }),
        prisma.book.count({ where })
      ]);

      res.json({
        data: books,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getBook(req: Request, res: Response, next: NextFunction) {
    try {
      const bookId = parseInt(req.params.id);
      if (isNaN(bookId) || bookId <= 0) {
        throw new ValidationError('Invalid book ID', {
          field: 'id',
          value: req.params.id
        });
      }

      // check cache first
      const cacheKey = `book:${bookId}`;
      const cachedData = await cache.get(cacheKey) as string;
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      const [book, ratingStats] = await Promise.all([
        prisma.book.findUnique({
          where: { id: bookId },
          include: {
            borrowHistory: {
              orderBy: { borrowedAt: 'desc' },
              include: {
                user: {
                  select: { 
                    id: true,
                    name: true 
                  }
                }
              }
            },
            currentOwner: {
              select: { id: true, name: true },
            },
          },
        }),

        // get average rating
        prisma.borrowHistory.aggregate({
          where: {
            bookId,
            score: { not: null }
          },
          _avg: {
            score: true
          },
          _count: {
            score: true
          }
        })
      ]);

      if (!book) {
        throw new NotFoundError('Book not found');
      }

      const response = {
        id: book.id,
        name: book.name,
        author: book.author,
        year: book.year,
        currentOwner: book.currentOwner?.name,
        score: ratingStats._avg.score
          ? Number(ratingStats._avg.score.toFixed(2))
          : -1,
        borrowHistory: book.borrowHistory.map(h => ({
          borrowedAt: h.borrowedAt,
          returnedAt: h.returnedAt,
          score: h.score,
          borrower: h.user.name,
          userId: h.user.id
        })),
        stats: {
          totalBorrows: book.borrowHistory.length,
          lastBorrowed: book.borrowHistory[0]?.borrowedAt || null,
          isAvailable: !book.currentOwner
        }
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
} 