class AuthorDTO {
  /**
   * Parses and sanitizes incoming request data.
   * This acts as a filter, protecting the Service layer from bad data
   * and ignoring any unpermitted fields sent by the client.
   */
  static fromRequest(body) {
    return {
      name: body.name ? String(body.name) : undefined,
      birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
      bio: body.bio ? String(body.bio) : undefined,
    };
  }

  /**
   * Formats the entity for the client response.
   * Ensures the client only receives safe, public-facing information
   * decoupling the DB schema from the API response payload.
   */
  static toResponse(author) {
    if (!author) return null;
    return {
      id: author.id,
      name: author.name,
      birthDate: author.birthDate,
      bio: author.bio,
    };
  }
}

module.exports = AuthorDTO;
