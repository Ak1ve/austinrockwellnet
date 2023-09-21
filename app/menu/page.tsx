import { execSync } from "child_process";
import path from "path";

export default async function Index() {
    async function doThing() {
        "use server";
        const root = path.resolve(__dirname, "..\\..\\..\\..");
        const python = root + "\\venv\\bin\\python.exe";
        const script = root + "\\generate.py";
        console.log(root);
        console.log(python);
        console.log(script);
        // execSync(`${python} ${script}`, {encoding: "utf-8"})
        return Math.random();
    }
    return <>{await doThing()}</>
}

// TODO I think I can do server functions!! I just need to include a venv and include the code
// YESSSSSSSS