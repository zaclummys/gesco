import { Path } from "./Path";

export default interface GescoInterface {
    get (key: Path): any;
    set (key: Path, value: any): void;
}
