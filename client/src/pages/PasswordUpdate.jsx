import { useState, React, useEffect } from "react";
import { useParams } from "react-router-dom"
import axios from "axios";

function Profile() {
    const { userId } = useParams();
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState({});

    // Mettre à jour les champs de la page
    const onFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData, [name]: value
        })
    }

    const Update = () => {
        const instance = axios.create({
            withCredentials: true
        });

        let body = {
            current_password: formData.current_password,
            new_password: formData.new_password
        };

        instance.put(`http://localhost:5000/users/update/update-password`, body)
            .then(function (res) {
                console.log(res)
            })
            .catch(function (error) {
                console.log(error)
            });
        // window.location.href = "/profile/update-password"
    }




    const validateEmail = (email) => {
        // Expression régulière simple pour une adresse email
        const regExp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        return String(email)
            .toLowerCase()
            .match(
                regExp
            );
    };

    const validatePassword = (pwd) => {
        // Expression régulière simple pour une adresse email
        const regExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return String(pwd)
            .match(
                regExp
            );
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const errors = {}

        if (!formData.current_password.trim())
            errors.current_password = "Please provide your previous password"
        else if (validatePassword(formData.current_password.trim()))
            errors.current_password = "Password incorrect"

        if (!formData.new_password.trim())
            errors.new_password = "Please provide your new password"
        else if (validatePassword(formData.new_password.trim()))
            errors.new_password = "Password incorrect"
        
        if (formData.new_password !== formData.password_confirm)
            errors.password_confirm = "Password confirmation incorrect"

        setFormErrors(errors);

        if (Object.keys(formErrors).length === 0)
            Update()
    }

    return (
        <>
            <div class="flex justify-left h-screen text-left bg-white">
                <div class="w-1/2 basis ">
                    <form class="bg-white rounded px-8 pb-8 mb-4 mx-auto pt-10" onSubmit={onSubmit}>
                        <h1 class="my-2 text-2xl font-bold text-blue-500">Update password</h1>
                        <div class="mb-3">
                            <label
                                class="block text-gray-700 text-sm mb-2"
                                for="password"
                            >
                                Current password
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                name="current_password"
                                type="password"
                                value={formData.current_password}
                                placeholder="Password"
                                onChange={onFormChange}
                            ></input>
                            {formErrors.current_password && <span class="text-red-600"> {formErrors.current_password} </span>}
                        </div>
                        <div class="mb-3">
                            <label
                                class="block text-gray-700 text-sm  mb-2"
                                for="phone_number"
                            >
                                New passsword
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="new_password"
                                name="new_password"
                                type="password"
                                value={formData.new_password}
                                placeholder="Password"
                                onChange={onFormChange}
                            ></input>
                            {formErrors.new_password && <span class="text-red-600"> {formErrors.new_password} </span>}
                        </div>
                        <div class="mb-3">
                            <label
                                class="block text-gray-700 text-sm mb-2"
                                for="phone_number"
                            >
                                Password confirm
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password_confirm"
                                name="password_confirm"
                                type="password"
                                value={formData.password_confirm}
                                placeholder="Password"
                                onChange={onFormChange}
                            ></input>
                            {formErrors.new_password && <span class="text-red-600"> {formErrors.new_password} </span>}
                        </div>
                        <div class="flex items-center justify-between">
                            <button
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Update password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Profile;
