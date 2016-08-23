/**
 *
 *   Vector2D.js
 *
 *   copyright 2001-2002, 2013 Kevin Lindsey
 *
 */

/**
 *  Vector2D
 *
 *  @param {Number} x
 *  @param {Number} y
 *  @returns {Vector2D}
 */
function Vector2D(x, y) {
    // [2015-03-28] Object.defineProperties is slow, 
    // when number of created Vector2D, Point2D and Matrix2D objects is high, 
    // like in calculating SVG intersections (multiplying, adding etc. creates new object)
    // intersection calculation can be drastically faster when not using Object.defineProperties
    // i.e. on my test machine, average calculation time of two test shapes intersections dropped
    // from ~3.5ms to ~0.54ms in Firefox,
    // from ~5.35ms to ~0.65ms in Chrome
    // from ~11.25ms to ~6.3ms in IE11

    //// use only in development (drastically slows down calculations)
    //Object.defineProperties(this, {
    //    "x": {
    //        value: x,
    //        writable: false,
    //        enumerable: true,
    //        configurable: false
    //    },
    //    "y": {
    //        value: y,
    //        writable: false,
    //        enumerable: true,
    //        configurable: false
    //    }
    //});

    this.x = x;
    this.y = y;
}

/**
 *  fromPoints
 *
 *  @param {Point2D} p1
 *  @param {Point2D} p2
 *  @returns {Vector2D}
 */
Vector2D.fromPoints = function(p1, p2) {
    return new Vector2D(
        p2.x - p1.x,
        p2.y - p1.y
    );
};

/**
 *  length
 *
 *  @returns {Number}
 */
Vector2D.prototype.length = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
};

/**
 *  magnitude
 *
 *  @returns {Number}
 */
Vector2D.prototype.magnitude = function() {
    return this.x*this.x + this.y*this.y;
};

/**
 *  dot
 *
 *  @param {Vector2D} that
 *  @returns {Number}
 */
Vector2D.prototype.dot = function(that) {
    return this.x*that.x + this.y*that.y;
};

/**
 *  cross
 *
 *  @param {Vector2D} that
 *  @returns {Number}
 */
Vector2D.prototype.cross = function(that) {
    return this.x*that.y - this.y*that.x;
}

/**
 *  determinant
 *
 *  @param {Vector2D} that
 *  @returns {Number}
 */
Vector2D.prototype.determinant = function(that) {
    return this.x*that.y - this.y*that.x;
};

/**
 *  unit
 *
 *  @returns {Vector2D}
 */
Vector2D.prototype.unit = function() {
    return this.divide( this.length() );
};

/**
 *  add
 *
 *  @param {Vector2D} that
 *  @returns {Vector2D}
 */
Vector2D.prototype.add = function(that) {
    return new Vector2D(this.x + that.x, this.y + that.y);
};

/**
 *  subtract
 *
 *  @param {Vector2D} that
 *  @returns {Vector2D}
 */
Vector2D.prototype.subtract = function(that) {
    return new Vector2D(this.x - that.x, this.y - that.y);
};

/**
 *  multiply
 *
 *  @param {Number} scalar
 *  @returns {Vector2D}
 */
Vector2D.prototype.multiply = function(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
};

/**
 *  divide
 *
 *  @param {Number} scalar
 *  @returns {Vector2D}
 */
Vector2D.prototype.divide = function(scalar) {
    return new Vector2D(this.x / scalar, this.y / scalar);
};

/**
 *  angleBetween
 *
 *  @param {Vector2D} that
 *  @returns {Number}
 */
Vector2D.prototype.angleBetween = function(that) {
    var cos = this.dot(that) / (this.length() * that.length());
    if (cos < -1) {
        cos = -1;
    }
    else if (cos > 1) {
        cos = 1;
    }
    var radians = Math.acos(cos);

    return (this.cross(that) < 0.0) ? -radians : radians;
};

/**
 *  Find a vector is that is perpendicular to this vector
 *
 *  @returns {Vector2D}
 */
Vector2D.prototype.perp = function() {
    return new Vector2D(-this.y, this.x);
};

/**
 *  Find the component of the specified vector that is perpendicular to
 *  this vector
 *
 *  @param {Vector2D} that
 *  @returns {Vector2D}
 */
Vector2D.prototype.perpendicular = function(that) {
    return this.subtract(this.project(that));
};

/**
 *  project
 *
 *  @param {Vector2D} that
 *  @returns {Vector2D}
 */
Vector2D.prototype.project = function(that) {
    var percent = this.dot(that) / that.dot(that);

    return that.multiply(percent);
};

/**
 *  transform
 *
 *  @param {Matrix2D}
 *  @returns {Vector2D}
 */
Vector2D.prototype.transform = function(matrix) {
    return new Vector2D(
        matrix.a * this.x + matrix.c * this.y,
        matrix.b * this.x + matrix.d * this.y
    );
};

/**
 *  equals
 *
 *  @param {Vector2D} that
 *  @returns {Boolean}
 */
Vector2D.prototype.equals = function(that) {
    return (
        this.x === that.x &&
        this.y === that.y
    );
};

/**
 *  toString
 *
 *  @returns {String}
 */
Vector2D.prototype.toString = function() {
    return "vector(" + this.x + "," + this.y + ")";
};

if (typeof module !== "undefined") {
    module.exports = Vector2D;
}
