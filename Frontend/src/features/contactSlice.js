import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [], // Keeps the list of contacts
};

export const contactsSlice = createSlice({
    name: "contacts",
    initialState,
    reducers: {
        setContacts: (state, action) => {
            // Replaces the entire list with new contacts
            state.list = action.payload;
        },
        addContact: (state, action) => {
            // Adds a contact only if it doesn't already exist in the list
            const contact = action.payload;
            const exists = state.list.find((item) => item._id === contact._id);
            if (!exists) {
                state.list.push(contact);
            }
        },
    },
});

export const { setContacts, addContact } = contactsSlice.actions;
export default contactsSlice.reducer;
