import { useState, React, useEffect } from "react";
import { useParams } from "react-router-dom"
import axios from "axios";
import welcome from "../email-welcome.svg"

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
            username: formData.username,
            phone_number: formData.phoneNumber,
            first_name: formData.first_name,
            last_name: formData.last_name,
            gender: formData.gender,
            birth_date: formData.birthDate,
            password: formData.password
        };

        instance.put(`${process.env.REACT_APP_API_LINK}users/${localStorage["user_id"]}`, body)
            .then(function (res) {
                setFormData({
                    first_name: res.data.first_name,
                    last_name: res.data.last_name,
                    username: res.data.username,
                    gender: res.data.gender,
                    phone_number: res.data.phone_number,
                    birth_date: res.data.birth_date.substring(0, 10),
                    email: res.data.email
                    //profile_picture: res.data.profile_picture
                })
            
            }
            )
            .catch(function (error) {
                console.log(error)
            });
            window.location.href = "/profile/update-profile"
    }

    // Récupérer le profile utilisateur grace à l'identifiant Mongodb
    const getProfile = () => {

        const instance = axios.create({
            withCredentials: true
        });

        instance.get(`${process.env.REACT_APP_API_LINK}users/get-user`)
            .then(function (res) {
                setFormData({
                    first_name: res.data.first_name,
                    last_name: res.data.last_name,
                    username: res.data.username,
                    gender: res.data.gender,
                    phoneNumber: res.data.phone_number,
                    birthDate: res.data.birth_date?.substring(0, 10),
                    email: res.data.email,
                    profile_picture: res.data.profile_picture
                })
            })
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


    const onSubmit = (e) => {
        e.preventDefault();
        const errors = {}
        // Validation du nom utilisateur
        if (!formData.first_name.trim())
        errors.first_name = "Please provide a first name"
        else if (formData.first_name.trim().length < 3)
            errors.first_name = "First name is too short"

        if (!formData.last_name.trim())
            errors.last_name = "Please provide last name"
        else if (formData.last_name.trim().length < 3)
            errors.last_name = "Last name too short"

        if (!formData.username.trim())
            errors.username = "Please provide username"
        else if (formData.username.trim().length < 3)
            errors.username = "Please provide username"

        if (!formData.email.trim())
            errors.email = "Veuillez renseigner votre email"
        else if (!validateEmail(formData.email.trim()))
            errors.email = "Email incorrect"

        if (formData.birthDate === null)
            errors.birthDate = "VPlease provide birthdatee"

        // Enregistrer les erreurs
        setFormErrors(errors);

        if (Object.keys(formErrors).length === 0)
            Update()

    }

    useEffect(() => {
        getProfile()
    }, [])

    if (!formData) return <p>Chargement en cours</p>

    return (
        <>
            <div class="flex justify-left h-screen text-left bg-white">
                <div class="w-1/2 basis ">
                    <form class="bg-white rounded px-8 pb-8 mb-4 mx-auto pt-10" onSubmit={onSubmit}>
                        <h1 class="my-2 text-2xl font-bold text-blue-500 mb-3">Personal informations</h1>
                        <div class="mb-4">
                            <label
                                class="block text-gray-700 text-sm mb-2"
                                for="username"
                            >
                                Firstname
                            </label>
                            <input
                                class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="first_name"
                                name="first_name"
                                type="text"
                                placeholder="Firstname"
                                value={formData.first_name}
                                onChange={onFormChange}

                            ></input>
                            {formErrors.first_name && <span class="text-red-600"> {formErrors.first_name} </span>}
                        </div>
                        <div class="mb-4">
                            <label
                                class="block text-gray-700 text-sm mb-2"
                                for="username"
                            >
                                Lastname
                            </label>
                            <input
                                class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="last_name"
                                name="last_name"
                                type="text"
                                placeholder="Lastname"
                                value={formData.last_name}
                                onChange={onFormChange}
                            ></input>
                            {formErrors.last_name && <span class="text-red-600"> {formErrors.last_name} </span>}
                        </div>
                        <div class="mb-4">
                            <label
                                class="block text-gray-700 text-sm mb-2"
                                for="username"
                            >
                                Username
                            </label>
                            <input
                                class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Nom"
                                value={formData.username}
                                onChange={onFormChange}

                            ></input>
                            {formErrors.username && <span class="text-red-600"> {formErrors.username} </span>}
                        </div>
                        <div class="mb-3">
                            <label
                                class="block text-gray-700 text-sm mb-2"
                                for="birth_date"
                            >
                                Date de naissance
                            </label>
                            <input
                                class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                                id="birth_date"
                                name="birthDate"
                                type="date"
                                value={formData.birthDate}
                                placeholder="Ex: 2024:01:01"
                                onChange={onFormChange}
                            ></input>
                            {formErrors.birthDate && <span class="text-red-600"> {formErrors.birthDate} </span>}
                        </div>
                        <div class="mb-3">
                            <label
                                class="block text-gray-700 text-sm  mb-2"
                                for="email"
                            >
                                Email address
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                placeholder="nom@nomsociete.tld"
                                onChange={onFormChange}
                                readOnly
                            ></input>
                            {formErrors.email && <span class="text-red-600"> {formErrors.email} </span>}
                        </div>
                        <div class="mb-3">
                            <label
                                class="block text-gray-700 text-sm  mb-2"
                                for="phone_number"
                            >
                                Phone number
                            </label>
                            <input
                                class="mb-5 shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="phoneNumber"
                                name="phoneNumber"
                                type="text"
                                value={formData.phoneNumber}
                                placeholder="Nom utilisateur"
                                onChange={onFormChange}
                            ></input>
                            {formErrors.phoneNumber && <span class="text-red-600"> {formErrors.phoneNumber} </span>}
                        </div>
                        <div class="flex items-center justify-between">
                            <button
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Update infos
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Profile;
