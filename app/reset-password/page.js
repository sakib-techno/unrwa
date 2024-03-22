"use client";
import axiosClient from "@/app/axiosClient";
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'; // Changed from 'next/navigation' to 'next/router'
import { useEffect, useState } from "react";

function Login() {
    const router = useRouter();
    const [settings, setSettings] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const api_base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosClient.get('settings');
                console.log(data);
                setSettings(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs only once, similar to componentDidMount

    const submitForm = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setErrorMessage('');

        const info = {
            email: getCookie('forgetPasswordEmail'),
            password:code
        };

        try {
            const response = await axiosClient.put("reset-password", info);

            console.log(response.data);

            // if (data.status === 422) {
            //     setErrorMessage('Invalid Credentials');
            // }
            if (response.data.success==true) {
                setSuccessMessage("Password Reset Successfully");
                router.push('/login', { scroll: false });
            } else {
                setErrorMessage(response.data.msg);
            }
        } catch (error) {
            console.error("Error occurred during login:", error);
            setErrorMessage('An error occurred during login');
        }
    };

    return (
        <div className='flex h-screen overflow-hidden'>
            {/* Content area */}
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                <main>
                    <div className='px-4 sm:px-6 lg:px-8 w-full'>
                        <div className='font-sans antialiased bg-grey-lightest'>
                            {/* Content */}
                            <div className='w-full bg-grey-lightest min-h-screen flex items-center justify-center py-16'>
                                <div className='container max-w-[650px] px-2 sm:px-4 mx-auto'>
                                    <div className='mx-auto bg-white rounded-xl shadow'>
                                        <div className='px-8 py-10'>
                                            <a href='/' className='max-w-[120px] mx-auto mb-2.5 block'>

                                            </a>
                                            <h2 className='text-[24px] sm:text-[28px] text-grey-darker text-center mb-10'>
                                                Reset Password
                                            </h2>
                                            {successMessage && (
                                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4" role="alert">
                                                    <strong className="font-bold">Success!</strong>
                                                    <span className="block sm:inline">{successMessage}</span>
                                                </div>
                                            )}
                                            {errorMessage && (
                                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                                                    <strong className="font-bold">Error!</strong>
                                                    <span className="block sm:inline">{errorMessage}</span>
                                                </div>
                                            )}
                                            <form onSubmit={submitForm}>
                                                <div className='mb-4'>
                                                    <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='email-address'>
                                                        Email Address
                                                    </label>
                                                    <input
                                                        className='appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                                                        id='email'
                                                        type='email'
                                                        readOnly
                                                        placeholder='Your email address'
                                                        value={getCookie('forgetPasswordEmail')}
                                                        onChange={e => setEmail(e.target.value)}
                                                    />
                                                </div>
                                                <div className='mb-4'>
                                                    <label className='block text-grey-darker text-sm font-bold mb-2' htmlFor='email-address'>
                                                        Password
                                                    </label>
                                                    <input
                                                        className='appearance-none border rounded w-full py-2 px-3 text-grey-darker'
                                                        id='email'
                                                        type='password'
                                                        placeholder='Your password'
                                                        value={code}
                                                        onChange={e => setCode(e.target.value)}
                                                    />
                                                </div>

                                                <div className='flex items-center justify-between mt-8'>
                                                    <button className='bg-indigo-600 duration-300 leading-normal transition opacity-90 hover:opacity-100 text-white font-bold py-2 px-4 rounded' type="submit">
                                                        Verify
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Login;
