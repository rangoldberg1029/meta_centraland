import axios from 'axios';
const URL = 'http://localhost:5000/metaCentraland/';

//////////////api get user/////////////////////
export const getUser = (user) =>
    axios.get(URL + 'login', {
        params: {
            userName: user.userName,
            password: user.password
        }
    })
    .then((res) => {
        const data = res.data
        if (data == "null")
            return null;
        else
            return data;
    })
    .catch((e) => {
        console.log(e);
    })

//////////////api add user/////////////////////
export const addUser = (newUser) =>
    axios.post(URL + 'signup', newUser)
    .then((res) => {
        const data = res.data;
        if (data == 'UserName already exist please try again')
            return null;
        else
            return data;
    }).catch((err) => {
        console.log("falied")
    })
///////////////api replace owner///////////////
export const updateParcel = (rowIndex, colIndex, newOwner) =>
    axios.patch(URL + 'update', {
        x: rowIndex,
        y: colIndex,
        owner: newOwner
    })
    .then((res) => {
        const data = res.data;
        if (data == "null")
            return null;
        else
            return data
    }).catch((err) => {
        console.log(err);
    })

/////////////api get all parcels///////////////
export const getAllParcel = () =>
    axios.get(URL + 'parcels')
    .then((res) => {
        const parcels = res.data;
        if (parcels == "null") {
            return null;
        } else
            return parcels;
    }).catch((err) => {
        console.log(err);
    })

/////////////api get one parcel////////////////
export const getParcel = (rowIndex, colIndex) =>

    axios.get(URL + 'parcel', {
        params: {
            rowIndex: rowIndex,
            colIndex: colIndex
        }
    }).then((res) => {
        const data = res.data;
        if (data == "null") return null;
        else return data;
    }).catch((err) => {
        console.log(err);
    })

///////////////api init parcels////////////////
export const addParcels = (indexs) =>
    axios.post(URL + 'addParcel', indexs)
    .then((res) => {
        const data = res.data;
        if (data == "null") return null;
        else return data;

    }).catch((err) => {
        console.log(err);
    })

///////////////api edit one parcel//////////////
export const editParcel = (parcelIndex) =>
    axios.patch(URL + 'edit', parcelIndex)
    .then((res) => {
        const data = res.data;
        if (data === "null") {
            return null;
        } else
            return data;

    }).catch((err) => {
        console.log(err);
    })