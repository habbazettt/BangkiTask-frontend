import { useState } from "react"
import Navbar from "../../components/Navbar/Navbar"
import PasswordInput from "../../components/Input/PasswordInput"
import { Link, useNavigate } from "react-router-dom"
import { validateEmail } from "../../utils/helper"
import axiosInstance from "../../utils/axiosInstance"

const SignUp = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [path, setPath] = useState("")

    const navigate = useNavigate()

    const handleSignUp = async (e) => {
        e.preventDefault()

        if (!name) {
            setError("Name is required!")
            return
        }

        if (!email) {
            setError("Email is required!")
            return
        }

        if (!password) {
            setError("Password is required!")
            return
        }

        if (!validateEmail(email)) {
            setError("Invalid email address!")
            return
        }

        setError("")

        // Sign Up API Call
        try {
            const response = await axiosInstance.post('/create-account', {
                fullName: name,
                email,
                password,
                learningPath: path
            })

            // Handle Register Success
            if (response.data && response.data.error) {
                setError(response.data.message)
                return
            }

            if (response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken)
                navigate('/login')
            }
        } catch (error) {
            // Handle Register Error
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            } else {
                setError("An error occurred. Please try again later.")
            }
        }
    }
    return (
        <>
            <Navbar />

            <div className="flex justify-center items-center mt-28">
                <div className="w-96 border rounded bg-white px-7 py-10">
                    <form onSubmit={handleSignUp}>
                        <h4 className="text-2xl mb-7">Sign Up</h4>

                        <input
                            type="text"
                            placeholder="Name"
                            className="input-box"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Bangkit Email"
                            className="input-box"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <PasswordInput
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {
                            error && <p className="text-red-500 text-xs pb-1">{error}</p>
                        }

                        <select name="path" className={`input-box ${path !== "" ? "text-black" : "text-gray-400"}`} value={path} onChange={(e) => setPath(e.target.value)}>
                            <option value="">Choose Learning Path</option>
                            <option value="cloud-computing">Cloud Computing</option>
                            <option value="machile-learning">Machine Learning</option>
                            <option value="mobile-development">Mobile Development</option>
                        </select>

                        <button type="submit" className="btn-primary">
                            Sign Up
                        </button>

                        <p className="text-sm text-center mt-4">
                            Already have an account?{" "}<Link to="/login" className="font-medium text-primary underline">Login</Link>
                        </p>

                    </form>
                </div>
            </div >

        </>
    )
}

export default SignUp