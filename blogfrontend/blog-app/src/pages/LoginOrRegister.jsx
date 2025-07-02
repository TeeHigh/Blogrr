import AuthForm from "../components/AuthForm";

const LoginOrRegister = ({ mode, route }) => {
  return (
    <div
      style={{ display: "flex", height: "100vh" }}
      className="login-container"
    >
      <div className="login-left-side">
        <a href="/">
          <img
            src="/assets/logos/BlueOnTransparent.png"
            alt="Logo"
            className="login-logo"
          />
        </a>
        <AuthForm mode={mode} route={route} />
      </div>
      <div className="login-right-side">
        <div className="login-right-content">
          {mode === "login" ? (
            <>
              <h2 className="welcome-title">Welcome Back!</h2>
              <p className="login-description">
                Sign in to access your personalized dashboard{" "}
                <span className="highlighted">manage your blogs,</span> and
                connect with the community.
              </p>
              <p className="login-description">
                Enjoy a <span className="highlighted">seamless writing</span>{" "}
                and <span className="highlighted">reading</span> experience with
                our modern platform.
              </p>
            </>
          ) : (
            <>
              <h2 className="join-title">Join Us!</h2>
              <p className="login-description">
                <span className="highlighted">Create an account</span> to start
                sharing your thoughts, connect with others, and{" "}
                <span className="highlighted">explore</span> a world of ideas.
              </p>
              <p className="login-description">
                <span className="highlighted">Join our community</span> of
                writers and readers today!
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginOrRegister;
