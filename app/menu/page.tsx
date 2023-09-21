import { execSync } from "child_process";

export default async function Index() {
    async function doThing() {
        return  execSync("python3 generate.py", {encoding: "utf-8"});
    }
    return <>{await doThing()}</>
}