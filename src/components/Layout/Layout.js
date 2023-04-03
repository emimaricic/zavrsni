import Footer from "./Footer";
import Header from "./Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }) {
  return (
    <>
      <ToastContainer
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Header />
      <main className="mt-[152px] px-2 md:px-8 flex w-full justify-center">
        <div className="w-full max-w-[1440px] rounded-lg">{children}</div>
      </main>
      <Footer />
    </>
  );
}
