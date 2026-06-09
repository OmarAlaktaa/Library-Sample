const Review = require("../../Domain/Entities/Review");
const ReviewDTO = require("../DTOs/ReviewDTO");
const RatingDTO = require("../DTOs/RatingDTO");
const ReviewNotFoundException = require("../../Domain/Exceptions/Review/ReviewNotFoundException");
const DuplicateReviewException = require("../../Domain/Exceptions/Review/DuplicateReviewException");
const ReviewOwnershipException = require("../../Domain/Exceptions/Review/ReviewOwnershipException");
const BookNotFoundException = require("../../Domain/Exceptions/Book/BookNotFoundException");

class ReviewService {
  constructor(reviewRepository, bookRepository, logger) {
    this.reviewRepository = reviewRepository;
    this.bookRepository = bookRepository;
    this.logger = logger;
  }

  async createReview(bookId, userId, rating, comment) {
    this.logger.info("Creating review", { bookId, userId, rating });

    // Verify book exists (domain rule)
    const book = await this.bookRepository.getBookById(bookId);
    if (!book) {
      this.logger.warn("Review creation failed: book not found", { bookId });
      throw new BookNotFoundException(`Book with id ${bookId} not found`);
    }

    // Check for duplicate review (domain rule)
    const existingReview = await this.reviewRepository.findByUserAndBook(
      userId,
      bookId,
    );
    if (existingReview) {
      this.logger.warn("Duplicate review attempt", { bookId, userId });
      throw new DuplicateReviewException();
    }

    // Create and validate domain entity
    const review = Review.create({ bookId, userId, rating, comment });
    review.validate();

    // Persist review
    const createdReview = await this.reviewRepository.create({
      bookId: review.bookId,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    });

    // Recalculate book rating after review creation
    await this.recalculateBookRating(bookId);

    this.logger.info("Review created successfully", {
      reviewId: createdReview.id,
      bookId,
      userId,
    });

    return ReviewDTO.fromDomain(createdReview);
  }

  async getReviewsByBookId(bookId, page = 1, limit = 10) {
    this.logger.info("Fetching reviews for book", { bookId, page, limit });

    const { reviews, total, userMap } =
      await this.reviewRepository.findByBookId(bookId, { page, limit });

    const reviewDTOs = reviews.map((review) =>
      ReviewDTO.fromDomain(review, userMap[review.id] || null),
    );

    this.logger.info("Reviews fetched", {
      bookId,
      count: reviews.length,
      total,
    });

    return ReviewDTO.toPaginatedResponse(reviewDTOs, total, page, limit);
  }

  async getReviewById(reviewId) {
    this.logger.info("Fetching review by id", { reviewId });

    const result = await this.reviewRepository.findByIdWithUser(reviewId);
    if (!result) {
      this.logger.warn("Review not found", { reviewId });
      throw new ReviewNotFoundException(`Review with id ${reviewId} not found`);
    }

    return ReviewDTO.fromDomain(result.review, result.user);
  }

  async updateReview(reviewId, userId, isAdmin, rating, comment) {
    this.logger.info("Updating review", { reviewId, userId, isAdmin });

    // Find existing review
    const existingReview = await this.reviewRepository.findById(reviewId);
    if (!existingReview) {
      this.logger.warn("Review update failed: not found", { reviewId });
      throw new ReviewNotFoundException(`Review with id ${reviewId} not found`);
    }

    // Ownership check (domain-level authorization)
    if (!existingReview.isOwnedBy(userId) && !isAdmin) {
      this.logger.warn("Review update failed: unauthorized", {
        reviewId,
        requestingUser: userId,
        reviewOwner: existingReview.userId,
      });
      throw new ReviewOwnershipException();
    }

    // Create updated domain entity and validate
    const updatedReview = new Review({
      id: existingReview.id,
      bookId: existingReview.bookId,
      userId: existingReview.userId,
      rating,
      comment,
      createdAt: existingReview.createdAt,
      updatedAt: new Date(),
    });
    updatedReview.validate();

    // Persist changes
    const result = await this.reviewRepository.update(reviewId, {
      rating: updatedReview.rating,
      comment: updatedReview.comment,
    });

    // Recalculate book rating after review update
    await this.recalculateBookRating(existingReview.bookId);

    this.logger.info("Review updated successfully", {
      reviewId,
      bookId: existingReview.bookId,
    });

    return ReviewDTO.fromDomain(result);
  }

  async deleteReview(reviewId, userId, isAdmin) {
    this.logger.info("Deleting review", { reviewId, userId, isAdmin });

    // Find existing review
    const existingReview = await this.reviewRepository.findById(reviewId);
    if (!existingReview) {
      this.logger.warn("Review deletion failed: not found", { reviewId });
      throw new ReviewNotFoundException(`Review with id ${reviewId} not found`);
    }

    // Ownership check — admin can delete any review
    if (!existingReview.isOwnedBy(userId) && !isAdmin) {
      this.logger.warn("Review deletion failed: unauthorized", {
        reviewId,
        requestingUser: userId,
        reviewOwner: existingReview.userId,
      });
      throw new ReviewOwnershipException(
        "You must be the review owner or an admin to delete this review",
      );
    }

    const bookId = existingReview.bookId;

    // Delete review
    const deleted = await this.reviewRepository.delete(reviewId);
    if (!deleted) {
      this.logger.error("Review deletion failed after ownership check", {
        reviewId,
      });
      throw new ReviewNotFoundException(
        `Review with id ${reviewId} could not be deleted`,
      );
    }

    // Recalculate book rating after review deletion
    await this.recalculateBookRating(bookId);

    this.logger.info("Review deleted successfully", { reviewId, bookId });
  }

  async adminDeleteReview(reviewId) {
    this.logger.info("Admin deleting review", { reviewId });

    const existingReview = await this.reviewRepository.findById(reviewId);
    if (!existingReview) {
      this.logger.warn("Admin review deletion failed: not found", { reviewId });
      throw new ReviewNotFoundException(`Review with id ${reviewId} not found`);
    }

    const bookId = existingReview.bookId;
    await this.reviewRepository.delete(reviewId);
    await this.recalculateBookRating(bookId);

    this.logger.info("Admin deleted review", { reviewId, bookId });
  }

  async recalculateBookRating(bookId) {
    this.logger.info("Recalculating book rating", { bookId });

    const { totalRating, count } =
      await this.reviewRepository.aggregateRatingByBookId(bookId);
    const ratingDTO = RatingDTO.fromAggregation(totalRating, count);

    await this.bookRepository.updateRating(bookId, {
      average: ratingDTO.average,
      count: ratingDTO.count,
    });

    this.logger.info("Book rating recalculated", {
      bookId,
      average: ratingDTO.average,
      count: ratingDTO.count,
    });
  }

  async getBookRating(bookId) {
    const { totalRating, count } =
      await this.reviewRepository.aggregateRatingByBookId(bookId);
    return RatingDTO.fromAggregation(totalRating, count);
  }
}

module.exports = ReviewService;
