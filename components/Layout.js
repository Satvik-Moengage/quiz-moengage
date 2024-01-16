import Navbar from "./Navbar";
// import Appbar from "./common/Appbar"

export default function Layout({ children, showAppBar = true }) {
    return (
        <>
            {showAppBar && <Navbar />}
            <main>{children}</main>
        </>
    );
}
