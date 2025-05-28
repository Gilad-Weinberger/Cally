import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/shared/ui/LoadingSpinner";

const UserManagement = () => {
  const { user } = useAuth();
  const [dbUser, setDbUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [error, setError] = useState("");

  const availableRoles = ["client", "admin"];

  useEffect(() => {
    const fetchDbUser = async () => {
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) setDbUser(userSnap.data());
        else setDbUser(null);
      } else {
        setDbUser(null);
      }
    };
    fetchDbUser();
  }, [user]);

  useEffect(() => {
    if (dbUser?.role === "admin") fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbUser]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const usersCollection = collection(db, "users");
      const snapshot = await getDocs(usersCollection);
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setDeletingUserId(userId);
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      setError("Failed to delete user.");
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (
      !window.confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    )
      return;

    setUpdatingUserId(userId);
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        role: newRole,
      });

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      setError("Failed to update user role.");
      console.error("Error updating user role:", err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (!dbUser || dbUser.role !== "admin")
    return (
      <div className="p-8 text-center text-red-500 font-semibold">
        Access denied. Admins only.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow mt-4 sm:mt-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
        User Management
      </h2>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <>
          {/* Mobile: Card/List View */}
          <div className="flex flex-col gap-4 sm:hidden">
            {users.map((u) => (
              <div
                key={u.id}
                className="bg-gray-50 rounded-lg shadow-sm p-4 flex flex-col gap-2 border border-gray-200"
              >
                <div className="text-xs text-gray-400 break-all">
                  ID: {u.id}
                </div>
                <div className="font-medium text-gray-800">{u.email}</div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  Role:
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    disabled={updatingUserId === u.id}
                    className="font-semibold bg-white border border-gray-300 rounded px-2 py-1 text-sm disabled:opacity-50"
                  >
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {updatingUserId === u.id && (
                    <div className="w-4 h-4">
                      <LoadingSpinner />
                    </div>
                  )}
                </div>
                <button
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
                  onClick={() => handleDelete(u.id)}
                  disabled={deletingUserId === u.id}
                >
                  {deletingUserId === u.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>

          {/* Desktop: Table View */}
          <div className="overflow-x-auto hidden sm:block">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Role</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border break-all">{u.id}</td>
                    <td className="py-2 px-4 border">{u.email}</td>
                    <td className="py-2 px-4 border">
                      <div className="flex items-center gap-2">
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(u.id, e.target.value)
                          }
                          disabled={updatingUserId === u.id}
                          className="bg-white border border-gray-300 rounded px-2 py-1 text-sm disabled:opacity-50"
                        >
                          {availableRoles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                        {updatingUserId === u.id && (
                          <div className="w-4 h-4">
                            <LoadingSpinner />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4 border">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                        onClick={() => handleDelete(u.id)}
                        disabled={deletingUserId === u.id}
                      >
                        {deletingUserId === u.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;
