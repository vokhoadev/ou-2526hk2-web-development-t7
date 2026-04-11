import { useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import FilterSection from "../components/FilterSection";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import CMSNotification from "../components/CMSNotification";
import UserModal from "../components/UserModal";

export default function Users() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Breadcrumbs />
      <FilterSection />
      <UserTable onAddUser={() => setIsModalOpen(true)} />
      <UserForm />
      <CMSNotification />
      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
