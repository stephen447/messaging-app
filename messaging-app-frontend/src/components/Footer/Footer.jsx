import React, { useEffect } from "react";
import "./Footer.css";
import email from "../../media/images/footer-email.svg";
import linkedIn from "../../media/images/linkedIn.svg";
import github from "../../media/images/github.svg";

export default function Footer() {
  function alignFooter() {
    const bodyHeight = document.body.scrollHeight;
    const windowHeight = window.innerHeight;
    const footer = document.getElementById("footer");
    console.log(bodyHeight, windowHeight);
    if (bodyHeight < windowHeight) {
      console.log("here");
      footer.style.position = "fixed";
      footer.style.bottom = "0";
    } else {
      footer.style.position = "relative";
    }
  }

  useEffect(() => {
    alignFooter();
  }, []);
  //window.onresize = alignFooter;
  return (
    <div className="footer" id="footer">
      <h2 className="footer__header">Messaging</h2>
      <div className="socialElement">
        <a href="mailto: sdavidbyrne@gmail.com">
          {" "}
          <img alt="" className="socialIcons" src={email} />
        </a>
      </div>
      <div className="socialElement">
        <a
          href="https://www.linkedin.com/in/stephen-byrne-b4729321b/"
          target="_blank"
          rel="noreferrer"
        >
          <img className="socialIcons" alt="" src={linkedIn} />
        </a>
      </div>
      <div className="socialElement">
        <a
          href="https://github.com/stephen447"
          target="_blank"
          rel="noreferrer"
        >
          <img className="socialIcons" alt="" src={github} />
        </a>
      </div>
    </div>
  );
}
