const mongoose = require("mongoose");
const ReviewModel = require("../Models/ReviewModel");
const Review = require("../../../Domain/Entities/Review");

class MongoReviewRepository {
  constructor({ logger }) {
    this.logger = logger;
  }

  // Maps a Mongoose document to a domain Review entity.

  _toDomain(doc) {
    if (!doc) return null;
    return new Review({
      id: doc._id.toString(),
      bookId: doc.bookId.toString(),
      userId: doc.userId.toString(),
      rating: doc.rating,
      comment: doc.comment,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findById(id) {
    const doc = await ReviewModel.findById(id).lean();
    return this._toDomain(doc);
  }

  async findByIdWithUser(id) {
    const doc = await ReviewModel.findById(id)
      .populate("userId", "name email")
      .lean();
    if (!doc) return null;

    const review = this._toDomain(doc);
    const user = doc.userId
      ? {
          id: doc.userId._id.toString(),
          name: doc.userId.name,
          email: doc.userId.email,
        }
      : null;

    return { review, user };
  }

  async findByBookId(bookId, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      ReviewModel.find({ bookId })
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ReviewModel.countDocuments({ bookId }),
    ]);

    const reviews = docs.map((doc) => this._toDomain(doc));
    const userMap = docs.reduce((map, doc) => {
      if (doc.userId) {
        map[doc._id.toString()] = {
          id: doc.userId._id.toString(),
          name: doc.userId.name,
          email: doc.userId.email,
        };
      }
      return map;
    }, {});

    return { reviews, total, userMap };
  }

  async findByUserAndBook(userId, bookId) {
    const doc = await ReviewModel.findOne({ userId, bookId }).lean();
    return this._toDomain(doc);
  }

  async create(reviewData) {
    const doc = await ReviewModel.create(reviewData);
    return this._toDomain(doc);
  }

  async update(id, updateData) {
    const doc = await ReviewModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).lean();
    return this._toDomain(doc);
  }

  async delete(id) {
    const result = await ReviewModel.findByIdAndDelete(id);
    return result !== null;
  }

  async countByBookId(bookId) {
    return ReviewModel.countDocuments({ bookId });
  }

  async aggregateRatingByBookId(bookId) {
    const result = await ReviewModel.aggregate([
      {
        $match: {
          bookId: new mongoose.Types.ObjectId(bookId),
        },
      },
      {
        $group: {
          _id: null,
          totalRating: { $sum: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return {
        totalRating: 0,
        count: 0,
      };
    }

    return {
      totalRating: result[0].totalRating,
      count: result[0].count,
    };
  }
}

module.exports = MongoReviewRepository;
