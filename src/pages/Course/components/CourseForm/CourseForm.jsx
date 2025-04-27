import { useState, useEffect } from "react";
import GroupItem from "../GroupItem/GroupItem";
import axios from "axios";
import { toast } from "react-toastify";

const CourseForm = ({ courseId, isSave, CourseName, onCourseUpdated }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setErrors] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedGroups, setEditedGroups] = useState([]);
  const [courseName, setCourseName] = useState(CourseName || "");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}/api/groups/groups-by-course/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        console.log("----- res.data: ", data);
        setGroups(data);
        setEditedGroups(data.map((group) => ({ ...group })));
        setLoading(false);
      } catch (error) {
        setErrors("Помилка при завантаженні груп");
        setLoading(false);
      }
    };
    fetchGroups();
  }, [courseId, token]);

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
      studentCount: 0,
      CourseId: courseId,
      changeType: "created",
      Student: []
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
            `${process.env.REACT_APP_BASE_API_URL}/api/groups/`,
            newGroup,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ).then((response) => {
            toast.success(
              <div>
                <p>Групу успішно створено!</p>
                <p>Назва: {group.GroupName}</p>
              </div>,
              { autoClose: 5000 }
            );
            return response;
          });
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
            `${process.env.REACT_APP_BASE_API_URL}/api/groups/${updateGroup.GroupId}`,
            updateGroup,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ).then(() => {
            toast.success(
              <div>
                <p>Групу успішно оновлено!</p>
                <p>Назва: {group.GroupName}</p>
              </div>,
              { autoClose: 5000 }
            );
          });
        })
      );

      await Promise.all(
        deleted.map((group) => {
          return axios.delete(
            `${process.env.REACT_APP_BASE_API_URL}/api/groups/${group.GroupId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ).then(() => {
            toast.success(
              <div>
                <p>Групу успішно видалено!</p>
                <p>Назва: {group.GroupName}</p>
              </div>,
              { autoClose: 5000 }
            );
          });
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
      console.error("Error saving changes:", err);
      toast.error(
        err.response?.data?.message || "Помилка при збереженні змін",
        { autoClose: 5000 }
      );
      setErrors("Помилка при збереженні змін");
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-purple-600 flex items-center">
        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Завантаження груп...
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 my-4">
      {error}
    </div>
  );

  return (
    <div className="w-full pb-24">
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold font-[Nunito] text-[#120C38] mb-6">
          {CourseName}
        </h1>

        <div className="space-y-4">
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
        </div>

        <div className="flex justify-center mt-8">
          <button
            className="px-6 py-3 bg-[#8A48E6] hover:bg-purple-700 text-white rounded-xl flex items-center gap-2 shadow-md transition-all"
            onClick={addNewGroup}
            disabled={isSaving}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Додати групу
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;