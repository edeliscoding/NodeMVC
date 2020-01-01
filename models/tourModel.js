const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal than 40 characters"], //this is a validator
      minlength: [10, "A tourname must have more or equal than 10 characters"],
      validate: [validator.isAlpha, "name must only contain characters"] //this is a validator
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"]
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "difficulty is either: easy, medium, difficult"
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"]
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 4.5
    },

    price: {
      type: Number,
      required: [true, "A tour must have a price"]
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          //this only pots to current doc on new document creation
          return val < this.price;
        },
        message: "Discount price ({value}) should be below regular price"
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"]
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"]
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false //excludes data from client's view
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
//properties that won't be saved in db but part of the model - used for calculations
tourSchema.virtual("durationWeeks").get(function() {
  return this.duration / 7;
});

// 1) DOCUMENT MIDDLEWARE: runs before .save() and create() -this is mongodb middleware
tourSchema.pre("save", function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre("save", function(next) {
//   console.log("Will save document");
//   next();
// });

// tourSchema.post("save", function(doc, next) {
//   console.log(doc);
//   next();
// });

// 2) QUERY MIDDLEWARE - runs before and after a query, in this case 'find' method
// tourSchema.pre(/^find/, function(next) {
//   // tourSchema.pre("find", function(next) {
//   this.find({ secretTour: { $ne: true } });
//   this.start = Date.now();
//   next();
// });

// tourSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} millisconds!`);
//   console.log(docs);
//   next();
// });

// 3) AGGREGATION MIDDLEWARE - before and after functions
tourSchema.pre("aggregate", function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
