import Stat from './Stat'
import '../styles/DashboardStats.scss';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { HiOutlineArchiveBox, HiOutlineNewspaper } from 'react-icons/hi2';
import { VscFileSubmodule } from "react-icons/vsc";

function DashbaordStats() {
  const stats = [
    {
      label: "Total Blogs",
      value: 42,
      // icon: <span role="img" aria-label="total">📝</span>,
      icon: <HiOutlineNewspaper />,
      color: "#2563eb"
    },
    {
      label: "Published Blogs",
      value: 30,
      // icon: <span role="img" aria-label="published">✅</span>,
      icon: <HiOutlineCheckCircle/>,
      color: "#22c55e"
    },
    {
      label: "Drafts",
      value: 8,
      // icon: <span role="img" aria-label="drafts">🗒️</span>,
      icon: <VscFileSubmodule />,
      color: "#f59e42"
    },
    {
      label: "Archived",
      value: 4,
      // icon: <span role="img" aria-label="archived">📦</span>,
      icon: <HiOutlineArchiveBox />,
      color: "#64748b"
    },
  ];

  return (
    <div className='dashboard-stats-container'>
      {stats.map((stat, index) => (
        <Stat key={index} stat={stat} />
      ))}
    </div>
  );
}

export default DashbaordStats