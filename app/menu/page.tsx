import { execSync } from "child_process";
import path from "path";

export default async function Index() {
    "use client";
    return <>{await fetch("/api/python")}</>
}
