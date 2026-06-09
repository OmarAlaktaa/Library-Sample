class RatingDTO {
  constructor({ average, count }) {
    this.average = average;
    this.count = count;
  }

  static fromAggregation(totalRating, count) {
    return new RatingDTO({
      average: count > 0 ? parseFloat((totalRating / count).toFixed(1)) : 0,
      count,
    });
  }

  static fromDocument(rating) {
    return new RatingDTO({
      average: rating?.average || 0,
      count: rating?.count || 0,
    });
  }
}

module.exports = RatingDTO;
