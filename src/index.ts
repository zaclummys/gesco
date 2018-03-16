import { Path, PathLike } from "./Path";

import GescoInterface from "./GescoInterface";
import CommitterInterface from "./CommitterInterface";

import { Computer, ComputerMany, ComputerCallback, ComputerManyCallback } from "./Computer";
import { Observer, ObserverMany, ObserverCallback, ObserverManyCallback } from "./Observer";

import { get, has, set, delete as unset } from 'dot-prop';

function some<T> (input: T | T[], callback: (input: T) => boolean): boolean {
    if (input instanceof Array) {
        return input.some(x => callback(x));
    }
    else {
        return callback(input);
    }
}

export class Gesco implements GescoInterface {
    observers: (Observer | ObserverMany) [] = [];
    computers: (Computer | ComputerMany) [] = [];

    static link (
        gesco1: Gesco,
        gesco2: Gesco,
        
        path1: PathLike,
        path2: PathLike,
        
        bidirectional: boolean = false,
    ): void {
        gesco1.observe(path1, value => gesco2.set(path2, value));

        if (bidirectional) {
            gesco2.observe(path2, value => gesco1.set(path1, value));
        }
    }

    constructor () {
        Data.set(this, {});
    }

    private __get (path: Path): any {
        return get(Data.get(this), path.toString());
    }

    private __has (path: Path): boolean {
        return has(Data.get(this), path.toString());
    }

    private __delete (path: Path): void {
        unset(Data.get(this), path.toString());
    }

    private __set (path: Path, value: any): void {
        set(Data.get(this), path.toString(), value);
    }

    link (path1: PathLike, path2: PathLike, bidirectional: boolean = false): void {
        Gesco.link(this, this, path1, path2, bidirectional);
    }

    get<T = any> (p: PathLike): T {
        return this.__get(Path.from(p));
    }

    has (p: PathLike): boolean {
        return this.__has(Path.from(p));
    }

    delete (p: PathLike, silently: boolean = false): void {
        this.__delete(Path.from(p));

        if (silently === false) {
            this.emit(p);
        }
    }

    set (p: PathLike, value: any, silently: boolean = false): void {        
        if (value === this.get(p)) {
            return;
        }

        this.__set(Path.from(p), value);     
        
        if (silently === false) {
            this.emit(p);
        }
    }

    compute<I = any> (to: PathLike, from: PathLike, callback: ComputerCallback<I>): void {
        this.fromComputer(new Computer(Path.from(to), Path.from(from), callback));
    }

    observe<I = any> (from: PathLike, callback: ObserverCallback<I>): void {
        this.fromObserver(new Observer(Path.from(from), callback));
    }

    computeMany<I = any> (to: PathLike, from: PathLike[], callback: ComputerManyCallback<I>): void {
        this.fromComputer(new ComputerMany(Path.from(to), Path.fromMany(from), callback));
    }

    observeMany<I> (from: PathLike[], callback: ObserverManyCallback<I>): void {
        this.fromObserver(new ObserverMany(Path.fromMany(from), callback));
    }

    emit<T> (p: PathLike, callback?: (value: T) => void): void {
        const path = Path.from(p);

        if (callback) {
            callback(this.get(p));
        }

        this.computers.forEach(x => this.commitAffected(x, path));
        this.observers.forEach(x => this.commitAffected(x, path));
    }
    
    fromComputer (computer: Computer | ComputerMany): void {
        this.computers.push(computer);

        this.commitExisting(computer);
    }

    fromObserver (observer: Observer | ObserverMany): void {
        this.observers.push(observer);        
        
        this.commitExisting(observer);
    }

    private commitAffected (committer: CommitterInterface, path: Path): void {
        let affects: boolean = some(committer.from, x => Path.isAffected(path, x));

        if (affects) {
            committer.commit(this);
        }
    }

    private commitExisting (committer: CommitterInterface): void {
        let exists: boolean = some(committer.from, x => this.has(x));

        if (exists) {
            committer.commit(this);
        }
    }

    isComputed (path: Path): boolean {
        return this.computers.some(computer => Path.isEqual(computer.to, path));
    }

    isObserved (path: Path): boolean {
        return this.observers.some(observer => some(observer.from, x => Path.isEqual(path, x)));
    }

    toString (): never {
        throw new Error;
    }
}

interface GescoData extends WeakMap<Gesco, object> {
    get (key: Gesco): object;
}

const Data = <GescoData> new WeakMap();

export {
    Computer,
    ComputerMany,
    ComputerCallback
};

export {
    Observer,
    ObserverMany,
    ObserverCallback,
};

export {
    Path,
    PathLike
};
