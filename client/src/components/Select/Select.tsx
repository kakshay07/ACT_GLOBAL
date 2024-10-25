import React, { ChangeEvent } from 'react';
import './Select.css'


interface DropdownProps {
    value?: string;
    placeholder?: string;
    styleClass?: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    required?: boolean;
    children: React.ReactNode ;
    label ?: string;
    name: string;
    disabled ?: boolean;
}

const SelectField: React.FC<DropdownProps> = ({
    value = '',
    styleClass = '',
    onChange,
    required,
    children,
    label,
    name ,
    disabled
}) => {
    // const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    //     const { value } = event.target;
    //     onChange(value);
    // };

    return (
        <div className={`flex flex-col justify-end flex-wrap  select-field mx-2 my-3 ${styleClass}`}>
            {label && <label className='w-full' htmlFor={name}>{label}{required && <span style={{color:'red'}}>*</span>}</label>}
            <select
                value={value}
                className="h-12 w-full rounded border border-gray-400 px-4 py-3 pe-12 text-sm shadow-sm"
                onChange={onChange}
                required = {required}
                name={name}
                disabled = {disabled}
                id={name}
            >
                {children}
            </select>
        </div>
    );
};

export default SelectField;
