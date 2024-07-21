import { useContext } from "react";
import { financeContext } from "@/lib/store/finance-context";

import Modal from "@/components/Modal";
import { currencyFormatter, dateFormatter } from "@/lib/utils";

import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

function ViewExpenseModal({ show, onClose, expense }) {
    // Destructure necessary functions from financeContext
    const { deleteExpenseItem, deleteExpenseCategory } =
        useContext(financeContext);
    // Handler function to delete an entire expense category
    const deleteExpenseHandler = async () => {
        try {
            // Attempt to delete the expense category by its ID
            await deleteExpenseCategory(expense.id);
            toast.success("Expense category deleted successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Handler function to delete a single expense item from a category
    const deleteExpenseItemHandler = async (item) => {
        try {
            // Filter out the item to be deleted from the list of expense items
            const updatedItems = expense.items.filter((i) => i.id !== item.id);

            // Create an updated expense object with the new list of items and updated total
            const updatedExpense = {
                items: [...updatedItems],
                total: expense.total - item.amount,
            };
            // Attempt to delete the expense item by updating the expense category
            await deleteExpenseItem(updatedExpense, expense.id);
            toast.success("Expense item removed successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="flex items-center justify-between">
                <h2 className="text-4xl">{expense.title}</h2>
                <button
                    onClick={deleteExpenseHandler}
                    className="btn btn-danger"
                >
                    Delete
                </button>
            </div>

            <div>
                <h3 className="my-4 text-2xl">Expense History</h3>
                {expense.items.map((item) => {
                    return (
                        <div
                            key={item.id}
                            className="flex items-center justify-between"
                        >
                            <small>
                                {item.createdAt.toMillis
                                    ? dateFormatter(
                                          new Date(
                                              item.createdAt.toMillis(),
                                          ).toISOString(),
                                      )
                                    : dateFormatter(
                                          item.createdAt.toISOString(),
                                      )}
                            </small>
                            <p className="flex items-center gap-2">
                                {currencyFormatter(item.amount)}
                                <button
                                    onClick={() => {
                                        deleteExpenseItemHandler(item);
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

export default ViewExpenseModal;
