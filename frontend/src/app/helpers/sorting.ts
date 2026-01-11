type KeySelector<T> = (item: T) => string | number | boolean;

export class OrderedArray<T> {
  private array: T[];
  private comparators: ((a: T, b: T) => number)[] = [];

  constructor(array: T[]) {
    this.array = array.slice();
  }

  private addComparator(
    selector: KeySelector<T>,
    descending: boolean
  ): OrderedArray<T> {
    this.comparators.push((a, b) => {
      let vA = selector(a);
      let vB = selector(b);

      // Normalize undefined values
      if (typeof vA === "undefined" || vA === null) {
        vA = typeof vB === "string" ? "" : 0;
      }
      if (typeof vB === "undefined" || vB === null) {
        vB = typeof vA === "string" ? "" : 0;
      }

      if (typeof vA === "string" && typeof vB === "string") {
        const cmp = vA.localeCompare(vB);
        return descending ? -cmp : cmp;
      }

      if (typeof vA === "boolean" && typeof vB === "boolean") {
        const cmp = Number(vA) - Number(vB);
        return descending ? -cmp : cmp;
      }

      if (typeof vA === "number" && typeof vB === "number") {
        if (vA < vB) return descending ? 1 : -1;
        if (vA > vB) return descending ? -1 : 1;
        return 0;
      }

      return 0;
    });
    return this;
  }

  orderBy(selector: KeySelector<T>): OrderedArray<T> {
    return this.addComparator(selector, false);
  }

  orderByDescending(selector: KeySelector<T>): OrderedArray<T> {
    return this.addComparator(selector, true);
  }

  thenBy(selector: KeySelector<T>): OrderedArray<T> {
    return this.addComparator(selector, false);
  }

  thenByDescending(selector: KeySelector<T>): OrderedArray<T> {
    return this.addComparator(selector, true);
  }

  toArray(): T[] {
    return this.array.slice().sort((a, b) => {
      for (const cmp of this.comparators) {
        const res = cmp(a, b);
        if (res !== 0) return res;
      }
      return 0;
    });
  }
}
