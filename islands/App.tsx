import AuthScreen from "@components/AuthScreen.tsx";
import MainScreen from "@components/MainScreen.tsx"; 
import * as s from "@logic/signals.ts";

export default function App() {
    return <div>
        {s.loggedIn.value ? <MainScreen/> : <AuthScreen/>}
    </div>;
}