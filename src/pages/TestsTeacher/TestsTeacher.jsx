import "./TestsTeacher.css";
import TestItem from "./components/TestItem/TestItem";
import SearchButton from "../Materials/components/SearchButton";
import Dropdown from "../../components/Dropdown/Dropdown";
import TaskButton from "../../components/TaskButton/TaskButton";
import { PrimaryButton } from "../../components/Buttons/Buttons";
import CreateModal from "./components/CreateModal/CreateModal";
import { useState } from "react";
import WaitModal from "./components/WaitModal/WaitModal";
import AddQuestion from "./components/AddQuestion/AddQuestion";
import TestForm from "./components/TestForm/TestForm";
const TestsTeacher = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="TestsTeacher">
      <div className="flex items-center m-2 gap-2">
        <TaskButton
          text="Назначені"
          isSelected={true}
          icon="M5 1H16M5 7H16M5 13H16M1 1V1.01M1 7V7.01M1 13V13.01"
        />
        <div className="ml-auto">
          <SearchButton />
        </div>
      </div>

      <div className="flex items-baseline space-x-4 m-2">
        <Dropdown />
        <Dropdown />
      </div>
      <div className="w-full min-w-0 overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(440px,1fr))] space-y-2">
          <TestItem />
          <TestItem />
          <TestItem />
          <TestItem />
          <TestItem />
        <AddQuestion taskNumber={1}/>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white z-10 p-4 flex justify-center items-center">
        <PrimaryButton className="w-96" onClick={handleOpenModal}>
          Створити
        </PrimaryButton>
      </div>

      {/* {isModalOpen && <CreateModal onClose={handleCloseModal} />} */}
      
      <WaitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
  
    </div>
  );
};

export default TestsTeacher;