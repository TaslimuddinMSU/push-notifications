import React, {
    useReducer
} from 'react'
const initialization = { count: 0 };

function reducer(state, action) {
    console.log(state, action);

    switch (action.type) {
        case 'INCREMENT':
            return { count: state.count + 1 };
        case 'DECREMENT':
            return { count: state.count != 0 ? state.count - 1 : 0 };
        case 'RESET':
            return { count: state.count = 0 }
    }
}

// handel form data
const formData = { name: '', age: '', address: '' };

function reducerForm(state, action) {
    console.log("form Reducer", action);
    switch (action.type) {
        case 'CHANGE_INPUT':
            const user = { ...state, [action.fields]: action.value };
            console.log("User Info", user)
            return { ...state, [action.fields]: action.value };
        case 'RESET':
            return formData;
        default:
            return state;
    }
}
const initializeUser = [];
function userReducer(state, action) {
    switch (action.type) {
        case 'SUBMIT':
            return [...state, action.payload];
        default:
            return state;
    }
}
const UseReducer = () => {

    const [state, dispatch] = useReducer(reducer, initialization);
    const [formState, dispatchForm] = useReducer(reducerForm, formData);

    // To push the user into a new array
    const [allUsers, dispatchUsers] = useReducer(userReducer, initializeUser)

    const handleOnchange = (e) => {
        dispatchForm({
            type: 'CHANGE_INPUT',
            fields: e.target.name,
            value: e.target.value,
        })
    }

    const handleButton = () => {
        if (!formState.name || !formState.age || !formState.address) {
            alert("Please fill all fields!");
            return;
        }
        dispatchUsers({
            type: 'SUBMIT',
            payload: formState
        })
    }
    return (
        <>
            <div>
                <div>UseReducer</div>
                <h2>{state.count}</h2>
                {/* <button onClick={() =>dispatch({type: 'INCREMENT'})}>INCREMENT</button> */}
                <button onClick={() => dispatch({ type: 'INCREMENT' })}>INCREMENT</button>
                <button onClick={() => dispatch({ type: 'DECREMENT' })}>DECREMENT</button>
                <button onClick={() => dispatch({ type: "RESET" })}>RESET</button>
            </div>

            <h2>Form Example</h2>
            <div>
                <input type='text' name='name' placeholder='Enter Name' value={formState.name} onChange={handleOnchange} />
                <input type='text' name='age' placeholder='Enter Age' value={formState.age} onChange={handleOnchange} />
                <input type='text' name='address' placeholder='Enter Address' value={formState.address} onChange={handleOnchange} />
                <button onClick={() => dispatchForm({ type: "RESET" })}>RESET</button>

                <button type='button' onClick={handleButton}>Submit</button>
                <pre>{JSON.stringify(formState, null, 2)}</pre>
            </div>

            <h3>Users List:</h3>
            <ul>
                {allUsers.map((user, index) => (
                    <li key={index}>
                        {user.name} - {user.age} years - {user.address}
                    </li>
                ))}
            </ul>

        </>

    )
}

export default UseReducer