import { Path } from "./Path";

import CommitterInterface from "./CommitterInterface";
import GescoInterface from "./GescoInterface";

export type ObserverCallback<I> = (value: I) => void;
export type ObserverManyCallback<I> = (...values: I[]) => void;

export class Observer implements CommitterInterface {
    constructor (public readonly from: Path, private readonly callback: ObserverCallback<any>) {}

    commit (gesco: GescoInterface) {
        this.callback(gesco.get(this.from));
    }
}

export class ObserverMany implements CommitterInterface {
    constructor (public readonly from: Path[], private readonly callback: ObserverManyCallback<any>) {}

    commit (gesco: GescoInterface) {
        const values = this.from.map(p => gesco.get(p));

        this.callback(...values);
    }
}
