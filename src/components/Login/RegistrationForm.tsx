import React, {useState} from 'react'
import s from './style.module.scss'
import {RegistrationFormValuesType} from './'
import viewIco from '../../assets/images/view.svg'

type PropsType = {
    onSubmit: (formData: RegistrationFormValuesType) => void
}

const RegistrationForm: React.FC<PropsType> = ({ onSubmit }) => {
    const [data, setData] = useState<RegistrationFormValuesType>({ email: '', name: '', surname: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSubmit(data)
    }

    return (
        <form className={s.registration} onSubmit={e => handleSubmit(e)}>
            <input type="email"
                   placeholder="email"
                   value={data.email}
                   onChange={e => setData({...data, email: e.target.value})}
                   required
            />

            <input type="text"
                   placeholder="name"
                   value={data.name}
                   onChange={e => setData({...data, name: e.target.value})}
                   required
            />

            <input type="text"
                   placeholder="surname"
                   value={data.surname}
                   onChange={e => setData({...data, surname: e.target.value})}
                   required
            />

            <div className={s.passwordField}>
                <input type={showPassword ? 'text' : 'password'}
                       placeholder="password"
                       value={data.password}
                       onChange={e => setData({...data, password: e.target.value})}
                       autoComplete="new-password"
                       required
                />
                {data.password &&
                <img className={s.showPassword}
                     onClick={() => setShowPassword(!showPassword)}
                     src={viewIco}
                     alt=""
                />}

            </div>

            <div>
                <button className="button button--primary" type="submit">Log In</button>
            </div>
        </form>
    )
}

export default RegistrationForm
