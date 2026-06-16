class ReviewController {
  constructor(reviewService, logger) {
    this.reviewService = reviewService;
    this.logger = logger;
  }

  async createReview(req, res, next) {
    const { bookId } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    this.logger.info("HTTP: Create review request", {
      bookId,
      userId,
      ip: req.ip,
    });

    const reviewDTO = await this.reviewService.createReview(
      bookId,
      userId,
      parseInt(rating, 10),
      comment,
    );

    res.status(201).json({
      success: true,
      data: reviewDTO,
      message: "Review created successfully",
    });
  }

  // Get reviews for a specific book with pagination
  async getReviewsByBook(req, res, next) {
    const bookId = req.params.bookId;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    this.logger.info("HTTP: Get reviews request", {
      bookId,
      page,
      limit,
      ip: req.ip,
    });

    const result = await this.reviewService.getReviewsByBookId(
      bookId,
      page,
      limit,
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  }

  async getReviewById(req, res, next) {
    const { id } = req.params;

    this.logger.info("HTTP: Get review by id", { reviewId: id, ip: req.ip });

    const reviewDTO = await this.reviewService.getReviewById(id);

    res.status(200).json({
      success: true,
      data: reviewDTO,
    });
  }

  async updateReview(req, res, next) {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";
    const { rating, comment } = req.body;

    this.logger.info("HTTP: Update review request", {
      reviewId: id,
      userId,
      isAdmin,
      ip: req.ip,
    });

    const reviewDTO = await this.reviewService.updateReview(
      id,
      userId,
      isAdmin,
      parseInt(rating, 10),
      comment,
    );

    res.status(200).json({
      success: true,
      data: reviewDTO,
      message: "Review updated successfully",
    });
  }

  async deleteReview(req, res, next) {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";

    this.logger.info("HTTP: Delete review request", {
      reviewId: id,
      userId,
      isAdmin,
      ip: req.ip,
    });

    await this.reviewService.deleteReview(id, userId, isAdmin);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  }

  async getBookRating(req, res, next) {
    const { bookId } = req.params;

    this.logger.info("HTTP: Get book rating request", { bookId, ip: req.ip });

    const ratingDTO = await this.reviewService.getBookRating(bookId);

    res.status(200).json({
      success: true,
      data: ratingDTO,
    });
  }
}

module.exports = ReviewController;
