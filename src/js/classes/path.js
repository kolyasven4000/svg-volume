const path = class Path {
  constructor(x, y, width) {
    this.left = x;
    this.top = y;
    this.width = width;
    this.barVolume = 0;
    this.volumeTickArr = [];
  }
  get barPath() {
    const { left, top } = this;
    return `M ${left} ${top}
              L ${left} ${this.barChangedPoint}
              L ${left + this.width} ${this.barChangedPoint}
              L ${left + this.width} ${top} Z ${this.barTopTailPath} ${
      this.barBottomTailPath
    }`;
  }
  get barTopTailPath() {
    const topTail = this.top - this.maxVolume;
    const boundTail = Math.min(this.top, this.barChangedPoint);
    return this.getBarTailTemplate(boundTail, topTail);
  }
  get barBottomTailPath() {
    const botTail = this.top - this.minVolume;
    const boundTail = Math.max(this.top, this.barChangedPoint);
    return this.getBarTailTemplate(boundTail, botTail);
  }
  get isPositiveBar() {
    return this.barVolume >= 0;
  }
  get pathState() {
    const { left, top, barPath, barVolume } = this;
    return { left, top, barPath, barVolume };
  }
  get fillColor() {
    return this.isPositiveBar ? "green" : "red";
  }
  get barChangedPoint() {
    return this.top - this.barVolume;
  }
  get maxVolume() {
    return Math.max(0, ...this.volumeTickArr);
  }
  get minVolume() {
    return Math.min(0, ...this.volumeTickArr);
  }
  get tailLeft() {
    return this.left + this.width / 2;
  }
  getBarTailTemplate(boundCoord, extremumCoord) {
    return `M ${this.tailLeft} ${boundCoord}
              L ${this.tailLeft} ${extremumCoord}
              L ${this.tailLeft} ${extremumCoord}
              L ${this.tailLeft} ${boundCoord} Z`;
  }
  setBarVolume(volume) {
    this.volumeTickArr.push(volume);
    this.barVolume = volume;
  }
  recalculateBarShift(leftShift) {
    this.left -= leftShift;
  }
};
export default path;
