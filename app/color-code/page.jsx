"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import Navbar from "@/components/shared/layout/Navbar"; // Import Navbar

const Page = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [colorCodes, setColorCodes] = useState({});
  const [topic, setTopic] = useState("");
  const [color, setColor] = useState("#000000");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editKey, setEditKey] = useState("");
  const [editColor, setEditColor] = useState("");

  useEffect(() => {
    const fetchColorCodes = async () => {
      try {
        const colorCodesRef = collection(db, "colorCodes");
        const q = query(colorCodesRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0]; // Take the first document
          const colorCodeData = docSnap.data();
          setColorCodes(colorCodeData.colorCodes || {}); // Set colorCodes state
        } else {
          console.error("No colorCode document found for the user.");
        }
      } catch (error) {
        console.error("Error fetching color codes:", error);
      }
    };

    fetchColorCodes();
  }, [user, router]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!topic) return;

    try {
      const colorCodesRef = collection(db, "colorCodes");
      const q = query(colorCodesRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0]; // Take the first document
        const colorCodeData = docSnap.data();
        const updatedColorCodes = {
          ...colorCodeData.colorCodes,
          [topic]: color,
        };

        await updateDoc(docSnap.ref, { colorCodes: updatedColorCodes }); // Update the colorCodes dictionary
        setColorCodes(updatedColorCodes); // Update local state
      } else {
        console.error("No colorCode document found for the user.");
      }
    } catch (error) {
      console.error("Error updating color codes:", error);
      alert("Error updating color codes");
    }

    setTopic("");
    setColor("#000000");
  };

  const handleDelete = async (key) => {
    try {
      const colorCodesRef = collection(db, "colorCodes");
      const q = query(colorCodesRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0]; // Take the first document
        const colorCodeData = docSnap.data();
        const updatedColorCodes = { ...colorCodeData.colorCodes };
        delete updatedColorCodes[key];

        await updateDoc(docSnap.ref, { colorCodes: updatedColorCodes }); // Update the colorCodes dictionary
        setColorCodes(updatedColorCodes); // Update local state
      } else {
        console.error("No colorCode document found for the user.");
      }
    } catch (error) {
      console.error("Error deleting color code:", error);
      alert("Error deleting color code");
    }
  };

  const handleEdit = (key, value) => {
    setEditKey(key);
    setEditColor(value);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const colorCodesRef = collection(db, "colorCodes");
      const q = query(colorCodesRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const colorCodeData = docSnap.data();
        const updatedColorCodes = {
          ...colorCodeData.colorCodes,
          [editKey]: editColor,
        };

        await updateDoc(docSnap.ref, { colorCodes: updatedColorCodes });
        setColorCodes(updatedColorCodes);
      } else {
        console.error("No colorCode document found for the user.");
      }
    } catch (error) {
      console.error("Error updating color codes:", error);
      alert("Error updating color codes");
    }

    setIsEditModalOpen(false);
    setEditKey("");
    setEditColor("");
  };

  if (!user) return null;

  return (
    <>
      <Navbar /> {/* Add Navbar */}
      <div className="max-w-3xl mx-auto p-6 font-sans">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Labels</h1>
        </div>
        {/* Form */}
        <form
          onSubmit={handleAdd}
          className="bg-white shadow-md p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter label name"
              required
              className="border border-gray-300 px-3 py-2 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
            >
              Add
            </button>
          </div>
        </form>
        {/* Label List */}
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">
            {Object.keys(colorCodes).length} labels
          </h2>
          <ul className="divide-y divide-gray-300">
            {Object.entries(colorCodes).map(([key, value]) => (
              <li key={key} className="flex justify-between items-center py-2">
                <div className="flex items-center gap-3">
                  <span
                    className="px-3 py-1 text-sm font-medium rounded-lg"
                    style={{ backgroundColor: value, color: "#fff" }}
                  >
                    {key}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(key, value)}
                    className="bg-gray-200 px-3 py-1 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(key)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }} // Adjusted background
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Edit Label</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="text"
                  value={editKey}
                  disabled
                  className="border border-gray-300 px-3 py-2 rounded-lg flex-grow bg-gray-100"
                />
                <input
                  type="color"
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
