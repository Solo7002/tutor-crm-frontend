import React, { useRef, useState, useEffect } from 'react';

export default function EnterCode({ callback, reset, isLoading }) {
    const [code, setCode] = useState('');

    // Refs to control each digit input element
    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];

    // Reset all inputs and clear state
    const resetCode = () => {
        inputRefs.forEach(ref => {
            ref.current.value = '';
        });
        inputRefs[0].current.focus();
        setCode('');
    }

    const freezeCode = () => {
        console.log("freeze");
        inputRefs.forEach(ref => {
            ref.current.disabled = "true";
        });
        //inputRefs[0].current.focus();
        //setCode('');
    }

    // Call our callback when code = 6 chars
    useEffect(() => {
        if (code.length === 6) {
            if (typeof callback === 'function') callback(code);
            resetCode();
            //freezeCode();
        }
    }, [code]); //eslint-disable-line

    // Listen for external reset toggle
    useEffect(() => {
        resetCode();
    }, [reset]); //eslint-disable-line

    // Handle input
    function handleInput(e, index) {
        const input = e.target;
        const previousInput = inputRefs[index - 1];
        const nextInput = inputRefs[index + 1];

        // Update code state with single digit
        const newCode = [...code];
        // Convert lowercase letters to uppercase
        if (/^[a-z]+$/.test(input.value)) {
            const uc = input.value.toUpperCase();
            newCode[index] = uc;
            inputRefs[index].current.value = uc;
        } else {
            newCode[index] = input.value;
        }
        setCode(newCode.join(''));

        input.select();

        if (input.value === '') {
            // If the value is deleted, select previous input, if exists
            if (previousInput) {
                previousInput.current.focus();
            }
        } else if (nextInput) {
            // Select next input on entry, if exists
            nextInput.current.select();
        }
    }

    // Select the contents on focus
    function handleFocus(e) {
        e.target.select();
    }

    // Handle backspace key
    function handleKeyDown(e, index) {
        const input = e.target;
        const previousInput = inputRefs[index - 1];
        const nextInput = inputRefs[index + 1];

        if ((e.keyCode === 8 || e.keyCode === 46) && input.value === '') {
            e.preventDefault();
            setCode((prevCode) => prevCode.slice(0, index) + prevCode.slice(index + 1));
            if (previousInput) {
                previousInput.current.focus();
            }
        }
    }

    // Capture pasted characters
    const handlePaste = (e) => {
        const pastedCode = e.clipboardData.getData('text');
        if (pastedCode.length === 6) {
            setCode(pastedCode);
            inputRefs.forEach((inputRef, index) => {
                inputRef.current.value = pastedCode.charAt(index);
            });
        }
    };

    return (
        <div className="flex justify-center gap-4 relative">
            {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                    className="text-2xl outline-none border focus:border-2 border-purple-600 rounded-md w-11 flex p-2 text-center"
                    key={index}
                    type="numeric"
                    maxLength={1}
                    onChange={(e) => handleInput(e, index)}
                    ref={inputRefs[index]}
                    autoFocus={index === 0}
                    onFocus={handleFocus}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    disabled={isLoading}
                />
            ))}
        </div>
    );
}