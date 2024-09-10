import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { signup } from "../../session"
import { Navigate } from "react-router-dom"

const SignupFormPage = () => {

    const dispatch = useDispatch()
    const currUser = useSelector(state => state.session.user)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [username, setUserName] = useState('')
    const [errors, setErrors] = useState({})

    if (currUser) return <Navigate to='/' replace={true}/>

    const handleSubmit = async e => {
        e.preventDefault()

        if (password === confirmPassword){
            setErrors({})
        }


        const user = {
            email,
            password,
            username
        }
        const res = dispatch(signup(user)).catch(async res => {
            res = await res.json()
            if (res.errors) setErrors(res.errors)
        })
        if (res.errors) setErrors(res.errors)
    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <label >
                    username
                    <input type="text"
                        value={username}
                        onChange={e => setUserName(e.target.value)} />
                </label>
                <label >
                    email
                    <input type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                </label>
                <label >
                    password
                    <input type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)} />
                </label>
                <label >
                    confirm password
                    <input type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)} />
                </label>
                 {errors && <p>{errors.errors}</p>}
                <button type='submit'>Sign Up</button>
            </form>
        </>
    )
}


export default SignupFormPage