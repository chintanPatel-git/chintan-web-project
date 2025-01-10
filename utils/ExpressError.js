class ExpreessError extends Error {
  constructor(statuscode, msg) {
    super();
    this.statuscode = statuscode;
    this.message = msg;
  }
}

module.exports = ExpreessError;
