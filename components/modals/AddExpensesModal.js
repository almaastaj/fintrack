"use client";

import { useState, useContext, useRef } from "react";
import { financeContext } from "@/lib/store/finance-context";

import { v4 as uuidv4 } from "uuid";
import Modal from "@/components/Modal";
import { toast } from "react-toastify";

function AddExpensesModal({ show, onClose }) {
    // State variables for managing expense amount, selected category, and visibility of add expense form
    const [expenseAmount, setExpenseAmount] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showAddExpense, setShowAddExpense] = useState(false);
    // Destructure necessary functions and state from financeContext
    const { expenses, addExpenseItem, addCategory } =
        useContext(financeContext);
    // Refs for title and color input fields
    const titleRef = useRef();
    const colorRef = useRef();
    // Handler function to add a new expense item to the selected category
    const addExpenseItemHandler = async () => {
        // Find the selected expense category
        const expense = expenses.find((e) => {
            return e.id === selectedCategory;
        });
        // Create a new expense object with updated items and total
        const newExpense = {
            color: expense.color,
            title: expense.title,
            total: expense.total + +expenseAmount,
            items: [
                ...expense.items,
                {
                    amount: +expenseAmount,
                    createdAt: new Date(),
                    id: uuidv4(),
                },
            ],
        };

        try {
            // Attempt to add the new expense item to the selected category
            await addExpenseItem(selectedCategory, newExpense);
            setExpenseAmount(""); // Clear the expense amount input
            setSelectedCategory(null); // Reset the selected category
            onClose(); // Close the modal or form
            toast.success("Expense Item Added!");
        } catch (error) {
            toast.error(error.message);
        }
    };
    // Handler function to add a new expense category
    const addCategoryHandler = async () => {
        const title = titleRef.current.value;
        const color = colorRef.current.value;

        try {
            // Attempt to add the new category
            await addCategory({ title, color, total: 0 });
            setShowAddExpense(false); // Hide the add expense form
            toast.success("Category created!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="flex flex-col gap-4">
                <label>Enter an amount..</label>
                <input
                    type="number"
                    min={1}
                    step={1}
                    placeholder="Enter expense amount"
                    value={expenseAmount}
                    onChange={(e) => {
                        setExpenseAmount(e.target.value);
                    }}
                />
            </div>

            {/* Expense Categories */}
            {expenseAmount > 0 && (
                <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl capitalize">
                            Select expense category
                        </h3>
                        <button
                            onClick={() => {
                                setShowAddExpense(true);
                            }}
                            className="text-indigo-900"
                        >
                            + New Category
                        </button>
                    </div>

                    {showAddExpense && (
                        <div className="flex items-center justify-between">
                            <input
                                type="text"
                                placeholder="Enter Title"
                                ref={titleRef}
                            />

                            <label>Pick Color</label>
                            <input
                                type="color"
                                className="w-24 h-10"
                                ref={colorRef}
                            />
                            <button
                                onClick={addCategoryHandler}
                                className="btn btn-primary-outline"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddExpense(false);
                                }}
                                className="btn btn-danger"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {expenses.map((expense) => {
                        return (
                            <button
                                key={expense.id}
                                onClick={() => {
                                    setSelectedCategory(expense.id);
                                }}
                            >
                                <div
                                    style={{
                                        boxShadow:
                                            expense.id === selectedCategory
                                                ? "1px 1px 4px"
                                                : "none",
                                    }}
                                    className="flex items-center justify-between px-2 py-2 bg-teal-300 rounded-3xl"
                                >
                                    <div className="flex items-center gap-2">
                                        {/* Colored circle */}
                                        <div
                                            className="w-[25px] h-[25px] rounded-full"
                                            style={{
                                                backgroundColor: expense.color,
                                            }}
                                        />
                                        <h4 className="capitalize">
                                            {expense.title}
                                        </h4>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {expenseAmount > 0 && selectedCategory && (
                <div className="mt-6">
                    <button
                        className="btn btn-primary"
                        onClick={addExpenseItemHandler}
                    >
                        Add Expense
                    </button>
                </div>
            )}
        </Modal>
    );
}

export default AddExpensesModal;
