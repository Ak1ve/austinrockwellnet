import { execSync } from "child_process";

export default async function Index() {
    async function doThing() {
        "use server";
        execSync(`.\\venv\\bin\\python.exe .\\generate.py`, {encoding: "utf-8"})
        return Math.random();
    }
    return <>{await doThing()}</>
}

// TODO I think I can do server functions!! I just need to include a venv and include the code
// YESSSSSSSS