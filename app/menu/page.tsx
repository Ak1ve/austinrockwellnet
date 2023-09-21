import { execSync } from "child_process";
import path from "path";

export default async function Index() {
    return <>{await fetch("/api/python")}</>
}
