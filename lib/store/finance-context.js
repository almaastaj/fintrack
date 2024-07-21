"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { authContext } from "@/lib/store/auth-context";

// Firebase
import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
    query,
    where,
} from "firebase/firestore";

// Create the financeContext with default values
export const financeContext = createContext({
    income: [],
    expenses: [],
    addIncomeItem: async () => {},
    removeIncomeItem: async () => {},
    addExpenseItem: async () => {},
    addCategory: async () => {},
    deleteExpenseItem: async () => {},
    deleteExpenseCategory: async () => {},
});

export default function FinanceContextProvider({ children }) {
    // State variables for income and expenses
    const [income, setIncome] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const { user } = useContext(authContext);
    // Function to add a new category of expenses
    const addCategory = async (category) => {
        try {
            const collectionRef = collection(db, "expenses");
            // Add a new document in the 'expenses' collection
            const docSnap = await addDoc(collectionRef, {
                uid: user.uid,
                ...category,
                items: [],
            });
            // Update the state with the new category
            setExpenses((prevExpenses) => {
                return [
                    ...prevExpenses,
                    {
                        id: docSnap.id,
                        uid: user.uid,
                        items: [],
                        ...category,
                    },
                ];
            });
        } catch (error) {
            throw error;
        }
    };
    // Function to add a new expense item to a category
    const addExpenseItem = async (expenseCategoryId, newExpense) => {
        const docRef = doc(db, "expenses", expenseCategoryId);

        try {
            await updateDoc(docRef, { ...newExpense });

            // Update the state with the new expense item
            setExpenses((prevState) => {
                const updatedExpenses = [...prevState];

                const foundIndex = updatedExpenses.findIndex((expense) => {
                    return expense.id === expenseCategoryId;
                });

                updatedExpenses[foundIndex] = {
                    id: expenseCategoryId,
                    ...newExpense,
                };

                return updatedExpenses;
            });
        } catch (error) {
            throw error;
        }
    };

    // Function to delete an expense item from a category
    const deleteExpenseItem = async (updatedExpense, expenseCategoryId) => {
        try {
            const docRef = doc(db, "expenses", expenseCategoryId);
            await updateDoc(docRef, {
                ...updatedExpense,
            });
            setExpenses((prevExpenses) => {
                const updatedExpenses = [...prevExpenses];
                const pos = updatedExpenses.findIndex(
                    (ex) => ex.id === expenseCategoryId,
                );
                updatedExpenses[pos].items = [...updatedExpense.items];
                updatedExpenses[pos].total = updatedExpense.total;
                return updatedExpenses;
            });
        } catch (error) {
            throw error;
        }
    };

    // Function to delete an entire expense category
    const deleteExpenseCategory = async (expenseCategoryId) => {
        try {
            const docRef = doc(db, "expenses", expenseCategoryId);
            await deleteDoc(docRef);

            setExpenses((prevExpenses) => {
                const updatedExpenses = prevExpenses.filter(
                    (expense) => expense.id !== expenseCategoryId,
                );

                return [...updatedExpenses];
            });
        } catch (error) {
            throw error;
        }
    };

    // Function to add a new income item
    const addIncomeItem = async (newIncome) => {
        const collectionRef = collection(db, "income");

        try {
            const docSnap = await addDoc(collectionRef, newIncome);

            // Update state
            setIncome((prevState) => {
                return [
                    ...prevState,
                    {
                        id: docSnap.id,
                        ...newIncome,
                    },
                ];
            });
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    };

    // Function to remove an income item by its ID
    const removeIncomeItem = async (incomeId) => {
        const docRef = doc(db, "income", incomeId);
        try {
            await deleteDoc(docRef);
            setIncome((prevState) => {
                return prevState.filter((i) => i.id !== incomeId);
            });
            // Update State
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    };

    // Context values to be provided to children components
    const values = {
        income,
        expenses,
        addIncomeItem,
        removeIncomeItem,
        addExpenseItem,
        addCategory,
        deleteExpenseItem,
        deleteExpenseCategory,
    };

    // Effect to fetch income and expenses data when user changes
    useEffect(() => {
        if (!user) return;

        const getIncomeData = async () => {
            const collectionRef = collection(db, "income");
            const q = query(collectionRef, where("uid", "==", user.uid));
            const docsSnap = await getDocs(q);

            const data = docsSnap.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                    createdAt: new Date(doc.data().createdAt.toMillis()),
                };
            });

            setIncome(data);
        };

        const getExpensesData = async () => {
            const collectionRef = collection(db, "expenses");
            const q = query(collectionRef, where("uid", "==", user.uid));
            const docsSnap = await getDocs(q);

            const data = docsSnap.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });

            setExpenses(data);
        };

        getIncomeData();
        getExpensesData();
    }, [user]);

    return (
        <financeContext.Provider value={values}>
            {children}
        </financeContext.Provider>
    );
}
