import { Head } from "$fresh/runtime.ts";
import App from "@islands/App.tsx";

export default function Home() {
    return (
        <>
            <Head>
                <title>Fresh FNBR</title>
                <link rel="stylesheet" href="style.css" />
            </Head>
            <App/>
        </>
    );
}
