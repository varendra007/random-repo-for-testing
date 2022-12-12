import React from "react";
import styles from "./index.module.css";

function index(props) {
  return (
    <div>
      <div className={styles.textwrapperw}>
        <div className={styles.titlew} data-content="404">
          403 - ACCESS DENIED
        </div>
        <div className={styles.subtitlew}>
          Oops, You don't have permission to access this page.
        </div>
        <div className={styles.isiw}>
          A web server may return a 403 Forbidden HTTP status code in response
          to a request from a client for a web page or resource to indicate that
          the server can be reached and understood the request, but refuses to
          take any further action. Status code 403 responses are the result of
          the web server being configured to deny access, for some reason, to
          the requested resource by the client.
        </div>
        <div className={styles.buttonsw}>
          <a className={styles.aw} href="/">
            Go to homepage
          </a>
        </div>
      </div>
    </div>
  );
}

export default index;
