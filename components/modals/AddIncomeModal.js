import { useRef, useEffect, useContext } from "react";
import { currencyFormatter } from "@/lib/utils";

import { financeContext } from "@/lib/store/finance-context";

// Icons
import { FaRegTrashAlt } from "react-icons/fa";

import Modal from "@/components/Modal";

function AddIncomeModal({ show, onClose }) {
    const amountRef = useRef();
    const descriptionRef = useRef();
    const { income, addIncomeItem, removeIncomeItem } =
        useContext(financeContext);

    // Handler Functions
    const addIncomeHandler = async (e) => {
        e.preventDefault();

        const newIncome = {
            amount: amountRef.current.value,
            description: descriptionRef.current.value,
            createdAt: new Date(),
        };

        try {
            await addIncomeItem(newIncome);
            descriptionRef.current.value = "";
            amountRef.current.value = "";
        } catch (error) {
            console.log(error.message);
        }
    };

    const deleteIncomeEntryHandler = async (incomeId) => {
        try {
            await removeIncomeItem(incomeId);
        } catch (error) {
            console.log(error.message);
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
                                    {i.createdAt.toISOString()}
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
