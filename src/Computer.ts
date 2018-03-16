import { Path } from "./Path";

import GescoInterface from "./GescoInterface";
import CommitterInterface from "./CommitterInterface";

export type ComputerCallback<I> = (value: I) => any;
export type ComputerManyCallback<I> = (...values: I[]) => any;

export class Computer implements CommitterInterface {
    constructor (public readonly to: Path, public readonly from: Path, private readonly callback: ComputerCallback<any>) {}

    commit (gesco: GescoInterface) {
        gesco.set(this.to, this.callback(gesco.get(this.from)));
    }
}

export class ComputerMany implements CommitterInterface {
    constructor (public readonly to: Path, public readonly from: Path[], private readonly callback: ComputerManyCallback<any>) {}

    commit (gesco: GescoInterface) {
        const values = this.from.map(p => gesco.get(p));
        const output = this.callback(...values);

        gesco.set(this.to, output);
    }
}
