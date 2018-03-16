import { Path } from "./Path";
import GescoInterface from "./GescoInterface";

export default interface CommitterInterface {
    from: Path | Path[];
    commit (gesco: GescoInterface): void;
}
