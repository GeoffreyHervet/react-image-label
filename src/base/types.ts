import { ArrayXY, PointArray, Rect, Text, Element, Circle as Circ } from '@svgdotjs/svg.js'
import Util from './util';


export type Point = { X: number, Y: number }

export abstract class IlShape {
  id: number;
  static containerOffset: ArrayXY;
  abstract labelPosition(): ArrayXY;
  abstract getCenter(): ArrayXY;
  getCenterWithOffset = (): ArrayXY => Util.ArrayXYSum(this.getCenter(), IlShape.containerOffset);
  abstract centerChanged(newCenter: ArrayXY): void;

  constructor(public classes: string[] = []) {
    this.id = 0;
  }
}

export interface IlElementExtra {
  classNames?: Text;
  classNamesWrapper?: Rect;
  shape: IlShape;
  shadow: Element;
  discs: Circ[];
  editing: boolean;
}

export type ElementWithExtra = Element & IlElementExtra;

export class AngledShape extends IlShape {
  constructor(public points: ArrayXY[] | PointArray = [], public classes: string[] = []) {
    super(classes);
  }
  labelPosition(): ArrayXY {
    let x = this.points
      .map(p => p[0])
      .filter((x, i) => i < this.points.length - 1)
      .reduce((sum: number, num) => sum + num, 0) / (this.points.length - 1);
    let y = Math.min(...this.points.map(p => p[1])) - 24;
    return [x, y];
  }

  getCenter(): ArrayXY {
    let x = this.points
      .map(p => p[0])
      .filter((x, i) => i < this.points.length - 1)
      .reduce((sum: number, num) => sum + num, 0) / (this.points.length - 1);
    let y = (Math.min(...this.points.map(p => p[1])) + Math.max(...this.points.map(p => p[1]))) / 2;
    return [x, y];
  }

  centerChanged(newCenter: ArrayXY): void {
    let oldCenter = this.getCenter();
    let dx = newCenter[0] - oldCenter[0], dy = newCenter[1] - oldCenter[1];
    this.points.forEach(point => {
      point[0] += dx;
      point[1] += dy;
    })
  }
}

export enum Color {
  BlackDisc = "#000",
  GreenDisc = "#009900",
  GrayDisc = "#a6a6a6",
  BlackLine = "#000",
  GreenLine = "#030",
  LightGreenLine = "#ccffcc",
  RedLine = "#f00",
  WhiteLine = "#fff",
  ShapeFill = "#ffffff00"
}

export class Rectangle extends AngledShape {
}

export class Square extends AngledShape {
}

export class Polygon extends AngledShape {
}