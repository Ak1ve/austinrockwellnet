"use client";
import { execSync } from "child_process";
import path from "path";

export default async function Index() {
    "use client";
    const [s, setS] = useState("");
    useEffect(() => {
        fetch("/api/python").then(x => {
            setS(x.body)
        })
    });
    return <>{s}</>
}
