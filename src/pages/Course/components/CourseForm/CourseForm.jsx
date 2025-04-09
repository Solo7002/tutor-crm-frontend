import { useState, useEffect } from "react";
import GroupItem from "../GroupItem/GroupItem";
import axios from "axios";

const CourseForm = ({ courseId, isSave,CourseName }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setErrors] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedGroups, setEditedGroups] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch groups when courseId changes
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/api/groups/groups-by-course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        setGroups(data);
        setEditedGroups(data.map((group) => ({ ...group })));
        setLoading(false);
      } catch (error) {
        setErrors("Помилка при завантаженні груп");
        setLoading(false);
      }
    };
    fetchGroups();
  }, [courseId]);

  // Trigger saveChanges when isSave becomes true
  useEffect(() => {
    if (isSave && !isSaving) {
      saveChanges();
    }
  }, [isSave]);

  const addNewGroup = () => {
    const newGroup = {
      GroupId: null,
      GroupName: "",
      GroupPrice: "",
      studentCount: "",
      CourseId: courseId,
      changeType: "created",
    };
    setGroups([...groups, newGroup]);
    setEditedGroups([...editedGroups, { ...newGroup }]);
  };

  const handleGroupChange = (groupIndex, field, value) => {
    const update = [...editedGroups];
    update[groupIndex] = {
      ...update[groupIndex],
      [field]: value,
      changeType:
        update[groupIndex].changeType === "created" ? "created" : "modified",
    };
    setEditedGroups(update);
  };

  const deleteGroup = (groupIndex) => {
    const updatedGroups = [...groups];
    const updateEditedGroups = [...editedGroups];

    if (updateEditedGroups[groupIndex].GroupId) {
      updateEditedGroups[groupIndex] = {
        ...updateEditedGroups[groupIndex],
        changeType: "deleted",
      };
    } else {
      updatedGroups.splice(groupIndex, 1);
      updateEditedGroups.splice(groupIndex, 1);
    }

    setGroups(updatedGroups);
    setEditedGroups(updateEditedGroups);
  };

  const saveChanges = async () => {
    try {
      setIsSaving(true);

      const created = editedGroups.filter((g) => g.changeType === "created");
      const modified = editedGroups.filter((g) => g.changeType === "modified");
      const deleted = editedGroups.filter((g) => g.changeType === "deleted");

      await Promise.all(
        created.map((group) => {
          const newGroup = {
            GroupName: group.GroupName,
            GroupPrice: group.GroupPrice,
            CourseId: group.CourseId,
          };
          return axios.post(
            `http://localhost:4000/api/groups/`,
            newGroup,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        })
      );

      await Promise.all(
        modified.map((group) => {
          const updateGroup = {
            GroupId: group.GroupId,
            GroupName: group.GroupName,
            GroupPrice: group.GroupPrice,
            CourseId: group.CourseId,
            ImageFilePath: group.ImageFilePath,
          };
          return axios.put(
            `http://localhost:4000/api/groups/${updateGroup.GroupId}`,
            updateGroup,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        })
      );

      await Promise.all(
        deleted.map((group) => {
          return axios.delete(
            `http://localhost:4000/api/groups/${group.GroupId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        })
      );

      const updatedGroups = editedGroups
        .filter((g) => g.changeType !== "deleted")
        .map((g) => ({
          ...g,
          GroupId: g.GroupId || Date.now() + Math.random(),
        }));

      setGroups(updatedGroups);
      setEditedGroups(updatedGroups.map((g) => ({ ...g })));
      setIsSaving(false);
    } catch (err) {
      setErrors("Помилка при збереженні змін");
      setIsSaving(false);
    }
  };

  if (loading) return <div className="text-center p-4">Завантаження...</div>;
  if (error) return <div className="text-center p-4 text-red-600">{error}</div>;

  return (
    <div className="w-full max-w-4xl mb-20   p-4 sm:p-6 min-h-screen">
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 w-full">
        <h1 className="text-center text-xl sm:text-2xl font-bold text-black mb-6 sm:mb-8 font-nunito">
        Курс: {CourseName}
        </h1>

        <div className="grid grid-cols-12 gap-4 sm:gap-6 mb-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="block text-purple-600 font-bold font-nunito text-sm sm:text-base">№</div>
          </div>
          <div className="col-span-4 sm:col-span-4">
            <div className="block text-purple-600 font-bold font-nunito text-sm sm:text-base">Назва групи</div>
          </div>
          <div className="col-span-3 sm:col-span-3">
            <div className="block text-purple-600 font-bold font-nunito text-sm sm:text-base">Кількість учнів</div>
          </div>
          <div className="col-span-3 sm:col-span-3">
            <div className="block text-purple-600 font-bold font-nunito text-sm sm:text-base">Ціна</div>
          </div>
        </div>

        {groups.map((group, groupIndex) =>
          editedGroups[groupIndex]?.changeType === "deleted" ? null : (
            <GroupItem
              key={group.GroupId || groupIndex}
              group={group}
              groupIndex={groupIndex}
              deleteGroup={deleteGroup}
              onChange={handleGroupChange}
              editedGroup={editedGroups[groupIndex]}
            />
          )
        )}

        <div className="flex justify-center gap-4 mt-6">
          <button
            className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center border-2 border-purple-700 text-white shadow-md hover:bg-purple-700 hover:border-purple-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-200"
            onClick={addNewGroup}
            disabled={isSaving}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;