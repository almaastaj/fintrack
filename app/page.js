"use client";
import { currencyFormatter } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

import ExpenseCategoryItem from "@/components/ExpenseCategoryItem";
import Modal from "@/components/Modal";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";

// Firebase
import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
} from "firebase/firestore";

// Icons
import { FaRegTrashAlt } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DUMMY_DATA = [
    {
        id: 1,
        title: "Entertainment",
        color: "#36A2EB",
        total: 500,
    },
    {
        id: 2,
        title: "Food",
        color: "#009",
        total: 200,
    },
    {
        id: 3,
        title: "Fuel",
        color: "#FF6384",
        total: 1200,
    },
    {
        id: 4,
        title: "Movies",
        color: "#FFCE56",
        total: 800,
    },
    {
        id: 5,
        title: "Holiday",
        color: "#150",
        total: 2000,
    },
];

export default function Home() {
    const [income, setIncome] = useState([]);

    const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
    const amountRef = useRef();
    const descriptionRef = useRef();

    // Handler Functions
    const addIncomeHandler = async (e) => {
        e.preventDefault();

        const newIncome = {
            amount: amountRef.current.value,
            description: descriptionRef.current.value,
            createdAt: new Date(),
        };

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

            descriptionRef.current.value = "";
            amountRef.current.value = "";
        } catch (error) {
            console.log(error.message);
        }
    };

    const deleteIncomeEntryHandler = async (incomeId) => {
        const docRef = doc(db, "income", incomeId);
        try {
            await deleteDoc(docRef);
            setIncome((prevState) => {
                return prevState.filter((i) => i.id !== incomeId);
            });
            // Update State
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        const getIncomeData = async () => {
            const collectionRef = collection(db, "income");
            const docsSnap = await getDocs(collectionRef);

            const data = docsSnap.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                    createdAt: new Date(doc.data().createdAt.toMillis()),
                };
            });

            setIncome(data);
        };

        getIncomeData();
    }, []);

    return (
        <>
            {/* Add Income Modal */}
            <Modal show={showAddIncomeModal} onClose={setShowAddIncomeModal}>
                <form
                    onSubmit={addIncomeHandler}
                    className="flex flex-col gap-4"
                >
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
                                    <p className="font-semibold">
                                        {i.description}
                                    </p>
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
            <main className="container max-w-2xl px-6 mx-auto">
                <section className="py-3">
                    <small className="text-blue-400 text-lg">My Balance</small>
                    <h2 className="text-4xl font-bold">
                        {currencyFormatter(100000)}
                    </h2>
                </section>

                <section className="flex items-center gap-2 py-3">
                    <button className="btn btn-primary" onClick={() => {}}>
                        + Expenses
                    </button>
                    <button
                        className="btn btn-primary-outline"
                        onClick={() => {
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            });
                            setShowAddIncomeModal(true);
                        }}
                    >
                        + Income
                    </button>
                </section>

                {/* Expenses */}
                <section className="py-6">
                    <h3 className="text-3xl font-semibold">My Expenses</h3>
                    <div className="flex flex-col gap-4 mt-6">
                        {DUMMY_DATA.map((expense) => {
                            return (
                                <ExpenseCategoryItem
                                    key={expense.id}
                                    color={expense.color}
                                    title={expense.title}
                                    total={expense.total}
                                />
                            );
                        })}
                    </div>
                </section>

                {/* Chart Section */}
                <section className="py-6">
                    <h3 className="text-2xl">Stats</h3>
                    <div className="w-1/2 mx-auto">
                        <Doughnut
                            data={{
                                labels: DUMMY_DATA.map(
                                    (expense) => expense.title,
                                ),
                                datasets: [
                                    {
                                        label: "Expenses",
                                        data: DUMMY_DATA.map(
                                            (expense) => expense.total,
                                        ),
                                        backgroundColor: DUMMY_DATA.map(
                                            (expense) => expense.color,
                                        ),
                                        borderColor: ["#dddd"],
                                        borderWidth: 3,
                                    },
                                ],
                            }}
                            options={{
                                plugins: {
                                    datalabels: {
                                        formatter: (value, context) => {
                                            const total =
                                                context.dataset.data.reduce(
                                                    (acc, val) => acc + val,
                                                    0,
                                                );
                                            const percentage = (
                                                (value / total) *
                                                100
                                            ).toFixed(2);
                                            return `${percentage}%`;
                                        },
                                        color: "#fff",
                                        font: {
                                            weight: "bold",
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </section>
            </main>
        </>
    );
}
