import { useRef, useEffect, useContext } from "react";
import { currencyFormatter, dateFormatter } from "@/lib/utils";
import { financeContext } from "@/lib/store/finance-context";
import { authContext } from "@/lib/store/auth-context";

// Icons
import { FaRegTrashAlt } from "react-icons/fa";

import Modal from "@/components/Modal";
import { toast } from "react-toastify";

function AddIncomeModal({ show, onClose }) {
    // References for form input elements
    const amountRef = useRef();
    const descriptionRef = useRef();
    // Retrieve context values for income operations and user authentication
    const { income, addIncomeItem, removeIncomeItem } =
        useContext(financeContext);
    const { user } = useContext(authContext);

    // Handler Functions
    // Handler function to add new income entry
    const addIncomeHandler = async (e) => {
        e.preventDefault();

        // Create a new income object with user input and current date
        const newIncome = {
            amount: +amountRef.current.value,
            description: descriptionRef.current.value,
            createdAt: new Date(),
            uid: user.uid,
        };

        try {
            // Attempt to add the new income item
            await addIncomeItem(newIncome);
            // Clear the form inputs after successful addition
            descriptionRef.current.value = "";
            amountRef.current.value = "";
            toast.success("Income added successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Handler function to delete an income entry
    const deleteIncomeEntryHandler = async (incomeId) => {
        try {
            // Attempt to remove the income item by its ID
            await removeIncomeItem(incomeId);
            toast.success("Income deleted successfully.");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={addIncomeHandler} className="flex flex-col gap-4">
                <div className="input-group">
                    <label htmlFor="amount">Income Amount</label>
                    <input
                        type="number"
                        name="amount"
                        ref={amountRef}
                        min={1}
                        step={1}
                        placeholder="Enter income amount"
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="description">Description</label>
                    <input
                        name="description"
                        ref={descriptionRef}
                        type="text"
                        placeholder="Enter income description"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Add entry
                </button>
            </form>

            <div className="flex flex-col gap-4 mt-6">
                <h3 className="text-2xl font-bold">Income History</h3>

                {income.map((i) => {
                    return (
                        <div
                            className="flex justify-between item-center"
                            key={i.id}
                        >
                            <div>
                                <p className="font-semibold">{i.description}</p>
                                <small className="text-xs">
                                    {dateFormatter(i.createdAt.toISOString())}
                                </small>
                            </div>
                            <p className="flex items-center gap-2">
                                {currencyFormatter(i.amount)}
                                <button
                                    onClick={() => {
                                        deleteIncomeEntryHandler(i.id);
                                    }}
                                >
                                    <FaRegTrashAlt />
                                </button>
                            </p>
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
}

export default AddIncomeModal;
