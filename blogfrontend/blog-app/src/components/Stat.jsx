import '../styles/Stat.scss';

function Stat({ stat = {} }) {

  const { icon, value, label, color } = stat;

  return (
    <div className="stat" style={{ borderColor: color }}>
      <div className="stat__icon" style={{ color }}>{icon}</div>
      <div>
        <div className="stat__value">{value}</div>
        <div className="stat__label">{label}</div>
      </div>
    </div>
  );
}

export default Stat