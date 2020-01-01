class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //BUILD query
    //excluding page, sort, limit, fields to allow them in url query while continue with regular query

    // 1A) FILTERING
    // tours?difficulty=easy&page=2&sort=1 - page and sort are excluded
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advance filtering
    // /tours?duration[gte]=5&difficulty=easy
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log(JSON.parse(queryStr));

    //code below is Mongoose way of finding/filtering
    // {difficulty : 'easy' , duration: {$gte: 5}}

    this.query = this.query.find(JSON.parse(queryStr));
    // let query = Tour.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    // 2) Sorting
    // if (req.query.sort) - looks for sort in query string in url
    // in URL /tours?sort=price - true
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    // 3) Field Limiting
    // in URL /tours?fields=name,duration,difficulty,price
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" "); //removes , and returns space
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); // - minus sign exlucdes the field being returned
    }
    return this;
  }
  paginate() {
    // 4) Pagination
    ///tours?page=4&limit=3 - note there are only 9 items in database
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit; // skip is how many records to skip before querying

    this.query = this.query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error("this page does not exist");
    // }
    return this;
  }
}
module.exports = APIFeatures;
