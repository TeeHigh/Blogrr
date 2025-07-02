
function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <span onClick={() => navigate("/")}>
        <img
          src="/assets/logos/BlueOnTransparent.png"
          className="logo"
          alt="Blogrr Logo"
        />
      </span>
      <div className="dashboard-header__actions"></div>
    </header>
  );
}

export default DashboardHeader;
