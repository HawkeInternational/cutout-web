declare class Point2D {
    constructor(x: number, y: number);

    clone(): Point2D;
    add(that: Point2D | Vector2D): Point2D;
    subtract(that: Point2D | Vector2D): Point2D;
    multiply(scalar: number): Point2D;
    divide(scalar: number): Point2D;
    equals(that: Point2D): boolean;
    lerp(that: Point2D | Vector2D, t: number): Point2D;
    distanceFrom(that: Point2D): number;
    min(that: Point2D): Point2D;
    max(that: Point2D): Point2D;
    transform(matrix: Matrix2D): Point2D;
    toString(): string;
}

declare class Vector2D {
    constructor(x: number, y: number);

    length(): number;
    magnitude(): number;
    dot(that: Vector2D): number;
    cross(that: Vector2D): number;
    determinant(that: Vector2D): number;
    unit(): Vector2D;
    add(that: Vector2D): Vector2D;
    subtract(that: Vector2D): Vector2D;
    multiply(scalar: number): Vector2D;
    divide(scalar: number): Vector2D;
    angleBetween(that: Vector2D): number;
    perp(): Vector2D;
    perpendicular(that: Vector2D): Vector2D;
    project(that: Vector2D): Vector2D;
    transform(matrix: Matrix2D): Vector2D;
    equals(that: Vector2D): boolean;
    toString(): string;

    static fromPoints(p1: Point2D, p2: Point2D): Vector2D;
}

declare class Matrix2D {
    constructor(a: number, b: number, c: number, d: number, e: number, f: number);

    multiply(that: Matrix2D): Matrix2D;
    inverse(): Matrix2D;
    translate(tx: number, ty: number): Matrix2D;
    scale(scale: number): Matrix2D;
    scaleAt(scale: number, center: Point2D): Matrix2D;
    scaleNonUniform(scaleX: number, scaleY: number): Matrix2D;
    scaleNonUniformAt(scaleX: number, scaleY: number, center: Point2D): Matrix2D;
    rotate(radians: number): Matrix2D;
    rotateAt(radians: number, center: Point2D): Matrix2D;
    rotateFromVector(vector: Vector2D): Matrix2D;
    flipX(): Matrix2D;
    flipY(): Matrix2D;
    skewX(radians: number): Matrix2D;
    skewY(radians: number): Matrix2D;
    isIdentity(): boolean;
    isInvertible(): boolean;
    getScale(): { scaleX: number; scaleY: number };
    getDecompositionTRSR(): { T: Matrix2D; R: Matrix2D; S: Matrix2D; R0: Matrix2D };
    equals(that: Matrix2D): boolean;
    toString(): string;

    static IDENTITY: Matrix2D;
}

declare class Intersection {
    points: Point2D[];
    status: string;

    static intersectShapes(shape1: IntersectionParams, shape2: IntersectionParams, m1?: Matrix2D, m2?: Matrix2D): Intersection;
}

declare class IntersectionParams {
    static newArc(startPoint: Point2D, endPoint: Point2D, rx: number, ry: number, angle, largeArcFlag: boolean, sweepFlag: boolean): IntersectionParams;
    static newBezier2(p1: Point2D, p2: Point2D, p3: Point2D): IntersectionParams;
    static newBezier3(p1: Point2D, p2: Point2D, p3: Point2D, p4: Point2D): IntersectionParams;
    static newCircle(c: Point2D, r: number): IntersectionParams;
    static newEllipse(c: Point2D, rx: number, ry: number): IntersectionParams;
    static newLine(a1: Point2D, a2: Point2D): IntersectionParams;
    static newPolygon(points: Point2D[]): IntersectionParams;
    static newPolyline(points: Point2D[]): IntersectionParams;
    static newPath(segments: IntersectionParams[]): IntersectionParams;
    static newRect(x: number, y: number, width: number, height: number): IntersectionParams;
    static newRoundRect (x: number, y: number, width: number, height: number, rx: number, ry: number): IntersectionParams;
}
