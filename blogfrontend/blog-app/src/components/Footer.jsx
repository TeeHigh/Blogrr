import "../styles/Footer.scss";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__logo-container">
        <div className="footer__logo">
        <a href="/">
          <img src="/assets/logos/WhiteOnTransparent.png" alt="Blogrr Logo" />
        </a>
      </div>
      </div>
      <div className="footer__content-container">
        <div className="footer__content">
          <p>
            &copy; {new Date().getFullYear()} Blog App. All rights reserved.
          </p>
          <p>
            Created by{" "}
            <a
              href="https://ifeoluwase.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline" }}
            >
              Ifeoluwase
            </a>
          </p>
        </div>
        <div className="footer__socials">
          <a
            href={"https://github.com/TeeHigh/"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
          <a
            href={"https://www.linkedin.com/in/ifeoluwase-oluwaseun-adebiyi/"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
          <a
            href={"https://twitter.com/TeeHigh_"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter />
          </a>
        </div>
        <div className="footer__links">
          <a href="/privacy-policy">Privacy Policy</a>•
          <a href="/terms-of-service">Terms of Service</a>•
          <a href="/contact">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
