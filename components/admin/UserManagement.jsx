import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/shared/ui/LoadingSpinner";

const UserManagement = () => {
  const { user } = useAuth();
  const [dbUser, setDbUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [error, setError] = useState("");

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

  if (!dbUser || dbUser.role !== "admin")
    return (
      <div className="p-8 text-center text-red-500 font-semibold">
        Access denied. Admins only.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
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
                  <td className="py-2 px-4 border">{u.role}</td>
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
      )}
    </div>
  );
};

export default UserManagement;
