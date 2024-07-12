"use client";
import { currencyFormatter } from "@/lib/utils";
import { useState } from "react";

import ExpenseCategoryItem from "@/components/ExpenseCategoryItem";
import Modal from "@/components/Modal";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DUMMY_DATA = [
    {
        id: 1,
        title: "Entertainment",
        color: "#078",
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
        color: "#000",
        total: 1200,
    },
    {
        id: 4,
        title: "Movies",
        color: "#015",
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
    const [modalIsOpen, setModalIsOpen] = useState(false);

    return (
        <>
            {/* Modal */}
            <Modal show={modalIsOpen} onClose={setModalIsOpen}>
                <h3>Hello World</h3>
            </Modal>
            <main className="container max-w-2xl px-6 mx-auto">
                <section className="py-3">
                    <small className="text-blue-400 text-lg">My Balance</small>
                    <h2 className="text-4xl font-bold">
                        {currencyFormatter(100000)}
                    </h2>
                </section>

                <section className="flex items-center gap-2 py-3">
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setModalIsOpen(true);
                        }}
                    >
                        + Expenses
                    </button>
                    <button className="btn btn-primary-outline">
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
                                        borderColor: ["#ffff"],
                                        borderWidth: 3,
                                    },
                                ],
                            }}
                        />
                    </div>
                </section>
            </main>
        </>
    );
}
