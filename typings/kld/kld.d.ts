declare class Point2D {
    constructor(x: number, y: number);

    clone(): Point2D;
    add(that: Point2D | Vector2D): Point2D;
    subtract(that: Point2D | Vector2D): Point2D;
    multiply(scalar: number): Point2D;
    divide(scalar: number): Point2D;
    equals(that: Point2D): boolean;
}

declare class Vector2D {
}

declare class Intersection {
    points: Point2D[];
    status: string;

    static intersectShapes(shape1: any, shape2: any, m1?: any, m2?: any): Intersection;
}

declare class IntersectionParams {
    static newCircle(c: Point2D, r: number): IntersectionParams;
    static newRect(x: number, y: number, width: number, height: number): IntersectionParams;
}
