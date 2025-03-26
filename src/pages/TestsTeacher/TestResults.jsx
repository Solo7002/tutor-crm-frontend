import "./TestResults.css";
import TaskButton from "../../components/TaskButton/TaskButton";
import StudentItem from "./components/StudentItem/StudentItem";
import { PrimaryButton } from "../../components/Buttons/Buttons";
const TestResults = () => {
  return (
    <div className="TestResults p-4 rounded-lg">

      <div className="text-left text-[#120c38] text-2xl font-bold font-['Nunito'] mb-4">
        Результати тесту: Основи геометрії. Прямокутна система координат
      </div>
      <div className="flex justify-between items-start">
        <div className="w-52">
          <div className="text-[#827ead] text-xl font-normal font-['Mulish']">
            Курс: Математика
          </div>
          <div className="text-[#827ead] text-xl font-normal font-['Mulish'] mt-2">
            Група: Математика-2
          </div>
        </div>
        <div className="text-right">
          <div className="text-[#827ead] text-xl font-normal font-['Mulish']">
            Видано: 01.03.2025
          </div>
          <div className="text-[#827ead] text-xl font-normal font-['Mulish'] mt-2">
            Термін до: 03.03.2025
          </div>
        </div>
      </div>
      <div className="flex space-x-4 m-2">
        <TaskButton text={'Виконало учнів'} icon={'M1 6L6 11L16 1'} isSelected={true} count={3} />
        <TaskButton text={'Не виконало учнів'} icon={'M3.63604 16.364C2.80031 15.5282 2.13738 14.5361 1.68508 13.4442C1.23279 12.3522 1 11.1819 1 10C1 8.8181 1.23279 7.64778 1.68508 6.55585C2.13738 5.46392 2.80031 4.47177 3.63604 3.63604C4.47177 2.80031 5.46392 2.13738 6.55585 1.68508C7.64778 1.23279 8.8181 1 10 1C11.1819 1 12.3522 1.23279 13.4442 1.68508C14.5361 2.13738 15.5282 2.80031 16.364 3.63604M3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 8.8181 18.7672 7.64778 18.3149 6.55585C17.8626 5.46392 17.1997 4.47177 16.364 3.63604M3.63604 16.364L16.364 3.63604'} count={3} />
      </div>
     
      <div className="w-full min-w-0  ">
  <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-4 max-h-[70vh] overflow-y-auto">
    <StudentItem name="Ім’я студента" date="01.03.2025" score={6} maxScore={12} status="Active" />
    <StudentItem name="Ім’я студента" date="01.03.2025" score={3} maxScore={12} status="Active" />
    <StudentItem name="Ім’я студента" date="01.03.2025" score={10} maxScore={12} status="Active" />
    <StudentItem name="Ім’я студента" date="01.03.2025" status="Default" />
    <StudentItem name="Ім’я студента" date="01.03.2025" score={6} maxScore={12} status="Active" />
    <StudentItem name="Ім’я студента" date="01.03.2025" score={3} maxScore={12} status="Active" />
    <StudentItem name="Ім’я студента" date="01.03.2025" score={10} maxScore={12} status="Active" />
    <StudentItem name="Ім’я студента" date="01.03.2025" status="Default" />
  </div>
</div>
      <div className="md:fixed bottom-0 left-0 right-0 bg-white z-10 p-2 flex justify-center items-center space-x-3">
        <PrimaryButton className="w-96" >
          Редагувати тест
        </PrimaryButton>
        <PrimaryButton className="w-96" >
        Видалити тест
        </PrimaryButton>
      </div>
    </div>
  )
}

export default TestResults;