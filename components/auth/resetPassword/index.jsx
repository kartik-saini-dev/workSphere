
"use client";
import { toast } from "react-toastify";
import Notification from "@/components/Notification";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { GlobalContext } from "@/context";
import ComponentLevelLoader from "@/components/Loader/index";
export default function ResetPassword() {

    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetSuccess, setResetSuccess] = useState(false);

    const {
        componentLevelLoader, setComponentLevelLoader
    } = useContext(GlobalContext);

    const  handleResetPassword = async () => {

        try {
            const res = await axios.post(`/api/resetPassword`, { token, password });

            if (res.success) {
                setComponentLevelLoader(false);
                toast.success(res.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setResetSuccess(true);
                router.push("/signIn");

            } else {
                toast.error(res.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
                setComponentLevelLoader({ loading: false, id: "" });
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");

    }, []);




    return (
        <>
            <div className="flex flex-col space-y-4">
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded-md focus:outline-none focus:border-blue-500"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border p-2 rounded-md focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={handleResetPassword}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-600"
                >
                    {componentLevelLoader && componentLevelLoader.loading ? (
                        <ComponentLevelLoader
                            text={"Resetting"}
                            color={"#ffffff"}
                            loading={
                                componentLevelLoader && componentLevelLoader.loading
                            }
                        />
                    ) : (
                        "Reset Password"
                    )}</button>
            </div>
            <Notification />
        </>

    );


}
