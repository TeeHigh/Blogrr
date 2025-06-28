import "../styles/Modal.scss";

function Overlay({children}) {
  return (
    <div className='modal-overlay'>
      {children}
    </div>
  )
}

export default Overlay