const PATH_REGEXP = /^((\w+)|(\w+(\.\w+)+))$/;

export type PathLike = Path | string;

export class Path {
    private readonly path: string;

    static from (p: PathLike): Path {
        if (p instanceof Path) {
            return p;
        }

        return new Path(p);
    }

    static fromMany (p: PathLike[]): Path[] {
        return p.map(Path.from);
    }

    static isValid (p: PathLike): boolean {
        if (p instanceof Path) {
            return true;
        }

        return !!p && PATH_REGEXP.test(p);
    }

    static isAffected (path1: PathLike, path2: PathLike): boolean {
        return Path.isEqual(path1, path2) || Path.isDescendant(path1, path2);
    }

    static isDescendant (x: PathLike, y: PathLike): boolean {
        return y.toString().indexOf(x.toString() + ".") === 0;
    }

    static isAncestor (x: PathLike, y: PathLike): boolean {
        return Path.isDescendant(y, x);
    }

    static isEqual (x: PathLike, y: PathLike): boolean {
        return x.toString() === y.toString();
    }

    static translate (newBase: PathLike, currentBase: PathLike, path: PathLike): PathLike {
        if (Path.isAffected(currentBase, path) === false) {
            throw new Error;
        }

        return newBase.toString() + path.toString().slice(currentBase.length);
    }

    static translateAffected (newBase: PathLike, currentBase: PathLike, p: PathLike): PathLike {
        if (Path.isAffected(currentBase, p)) {
            return Path.translate(newBase, currentBase, p);
        }

        return p;
    }

    static base (p: PathLike): PathLike {
        const dotIndex = p.toString().indexOf('.');

        if (dotIndex === -1) {
            return p;
        }

        return p.toString().slice(0, dotIndex);
    }

    constructor (path: string) {
        if (Path.isValid(path) === false) {
            throw new Error;
        }

        this.path = path;
    }

    toArray (): string[] {
        return this.path.split(".");
    }

    toString (): string {
        return this.path;
    }

    get length () {
        return this.path.length;
    }
}
