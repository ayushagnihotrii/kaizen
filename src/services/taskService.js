import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const TASKS_COLLECTION = 'tasks';

/**
 * Get real-time tasks for a specific user
 * @param {string} userId - Firebase Auth UID
 * @param {function} callback - Callback function to receive tasks array
 * @returns {function} Unsubscribe function
 */
export const getTasks = (userId, callback) => {
    const tasksRef = collection(db, TASKS_COLLECTION);
    const q = query(
        tasksRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    // Real-time listener
    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            const tasks = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(tasks);
        },
        (error) => {
            console.error('Error fetching tasks:', error);
            callback([]);
        }
    );

    return unsubscribe;
};

/**
 * Add a new task
 * @param {string} userId - Firebase Auth UID
 * @param {object} taskData - Task data (title, description, dueDate, dueTime)
 * @returns {Promise<DocumentReference>}
 */
export const addTask = async (userId, taskData) => {
    try {
        const tasksRef = collection(db, TASKS_COLLECTION);
        const newTask = {
            userId,
            title: taskData.title,
            description: taskData.description || '',
            dueDate: taskData.dueDate || null,
            dueTime: taskData.dueTime || null,
            isCompleted: false,
            isStarred: false,
            createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(tasksRef, newTask);
        return docRef;
    } catch (error) {
        console.error('Error adding task:', error);
        throw error;
    }
};

/**
 * Update an existing task
 * @param {string} taskId - Task document ID
 * @param {object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateTask = async (taskId, updates) => {
    try {
        const taskRef = doc(db, TASKS_COLLECTION, taskId);
        await updateDoc(taskRef, updates);
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
};

/**
 * Delete a task
 * @param {string} taskId - Task document ID
 * @returns {Promise<void>}
 */
export const deleteTask = async (taskId) => {
    try {
        const taskRef = doc(db, TASKS_COLLECTION, taskId);
        await deleteDoc(taskRef);
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};

/**
 * Toggle task completion status
 * @param {string} taskId - Task document ID
 * @param {boolean} isCompleted - New completion status
 * @returns {Promise<void>}
 */
export const toggleComplete = async (taskId, isCompleted) => {
    const updates = {
        isCompleted,
        completedAt: isCompleted ? serverTimestamp() : null
    };
    return updateTask(taskId, updates);
};

/**
 * Toggle task starred status
 * @param {string} taskId - Task document ID
 * @param {boolean} isStarred - New starred status
 * @returns {Promise<void>}
 */
export const toggleStar = async (taskId, isStarred) => {
    return updateTask(taskId, { isStarred });
};
