class User {
  constructor(id, name, email, password, role = "READER") {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

module.exports = User;
