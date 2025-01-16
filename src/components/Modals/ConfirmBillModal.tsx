import { Dialog, DialogTitle, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import { createUserSubscription } from "@/actions/actions"
import { usePaystackPayment } from 'react-paystack'
import { redirect } from 'next/navigation';

interface ModalProps {
    open?: boolean;
    setIsModalOpen: any;
    plan: any;
    user: any;
}
// export default function Modal({open}) {
const Modal = ({ open, setIsModalOpen, plan, user }: ModalProps) => {
    let [isOpen, setIsOpen] = useState(open)

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    // you can call this function anything
    const onSuccess = (reference: any) => {
        // Implementation for whatever you want to do with reference and after success call.

        createUserSubscription({ planData: plan });

    };

    // you can call this function anything
    const onClose = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        console.log('closed')

    }
    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: user?.email,
        amount: plan?.paystackPrice, // Will be set later based on the plan
        publicKey: "pk_test_4d73290887e91f8cba2337cd11986fbea0328a4c",
        currency: "KES",
        plan: plan?.paystackPlanId
    };
    const initializePayment = usePaystackPayment(paystackConfig);


    function closeModal() {
        initializePayment({ onSuccess, onClose })
        setIsModalOpen(false)
        redirect("/prompts/add");
    }

    return (
        <>


            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </TransitionChild>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <DialogTitle
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Billing alert.
                                    </DialogTitle>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            You are about to subscribe to
                                            <strong> {plan?.name}</strong> plan for KES
                                            <strong> {plan?.price}</strong> monthly.
                                            Press Confirm to proceed.
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default Modal;
