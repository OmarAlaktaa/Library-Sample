class AuthorDTO {
  static fromRequest(body) {
    return {
      name: body.name ? String(body.name) : undefined,
      birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
      bio: body.bio ? String(body.bio) : undefined,
    };
  }

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
