class ReviewDTO {
  constructor({
    id,
    bookId,
    userId,
    rating,
    comment,
    createdAt,
    updatedAt,
    user = null,
  }) {
    this.id = id;
    this.bookId = bookId;
    this.userId = userId;
    this.rating = rating;
    this.comment = comment;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    if (user) {
      this.user = user;
    }
  }

  static fromDomain(review, userInfo = null) {
    return new ReviewDTO({
      id: review.id,
      bookId: review.bookId,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
      createdAt:
        review.createdAt instanceof Date
          ? review.createdAt.toISOString()
          : review.createdAt,
      updatedAt:
        review.updatedAt instanceof Date
          ? review.updatedAt.toISOString()
          : review.updatedAt,
      user: userInfo,
    });
  }

  static fromRequest(body) {
    return {
      rating: parseInt(body.rating, 10),
      comment: body.comment ? body.comment.trim() : "",
    };
  }

  static fromDomainList(reviews) {
    return reviews.map((review) => ReviewDTO.fromDomain(review));
  }

  static toPaginatedResponse(reviews, total, page, limit) {
    return {
      data: reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }
}

module.exports = ReviewDTO;
