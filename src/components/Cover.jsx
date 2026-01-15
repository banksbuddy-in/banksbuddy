
import { useNavigate } from "react-router-dom";

export const Cover = ({ title, tagline, description, image }) => {
    const n = useNavigate();

    const getSplitTagline = (text) => {
        const defaultText = { p1: "Where vision meets action,", p2: "Success Follows." };
        if (!text) return defaultText;

        const words = text.split(" ");
        if (words.length < 2) return { p1: text, p2: "" };

        // Split roughly in half
        const mid = Math.ceil(words.length / 2);
        return {
            p1: words.slice(0, mid).join(" "),
            p2: words.slice(mid).join(" ")
        };
    };

    const { p1, p2 } = getSplitTagline(tagline);

    return (
        <div id="cover" style={{ backgroundImage: `url('${image || "/cc2.jpg"}')`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
            <h1>{p1} <span>{p2}</span></h1>
            <p>{description || "Dreams don’t wait. Neither should your finances. Get your Personal Loan with BanksBuddy"}</p>
            <button onClick={() => n("/contact-banksbuddy")}>Get Started</button>
        </div>
    );
}
