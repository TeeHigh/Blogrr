import Modal from "./Modal";
import "../styles/DashboardBlogItem.scss";
import NewEditBlog from "./NewEditBlog";
import ConfirmationModal from "./ConfirmationModal";
import { HiPencil, HiTrash } from "react-icons/hi2";

const DashboardBlogItem = ({ blog, onEdit, onDelete }) => {
  const { id, title, created_at } = blog;

  return (
    <Modal>
      <div className="dashboard-blog-item">
        <div className="dashboard-blog-item__content">
          <h3 className="dashboard-blog-item__title">{title}</h3>
          <p className="dashboard-blog-item__meta">
            Created on:{" "}
            {new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }).format(new Date(created_at))}
          </p>
        </div>
        <div className="dashboard-blog-item__actions">
          <Modal.Open opens="newBlogModal">
            <button
              className="dashboard-blog-item__edit"
              onClick={() => onEdit(id)}
            >
              Edit <HiPencil />
            </button>
          </Modal.Open>
          <Modal.Open opens='delete-blog'>
            <button
              className="dashboard-blog-item__delete"
            >
              Delete <HiTrash />
            </button>
          </Modal.Open>
        </div>
      </div>

      <Modal.Window name="newBlogModal">
        <NewEditBlog mode="edit" existingFormData={blog} />
      </Modal.Window>
      <Modal.Window name="delete-blog">
        <ConfirmationModal onConfirm={() => onDelete(id)} delicate={true}>
          <p>Are you sure you want to delete this blog?</p>
        </ConfirmationModal>
      </Modal.Window>
    </Modal>
  );
};

export default DashboardBlogItem;
