// React
import React, {useEffect, useState} from "react";

// Icons
import {icons} from "../icons";

// Axios
import axios from 'axios';

// Recoil
import {useRecoilValue} from "recoil";
import {userDataState} from "../store";

// Notification
import { ReactNotifications, Store } from "react-notifications-component";
import 'react-notifications-component/dist/theme.css';

function MeterList() {
    // All states used for editing, crceating, etc.
    const userData = useRecoilValue(userDataState);
    const [editing, setEditing] = useState(false);
    const [indexBeingEdited, setIndexBeingEdited] = useState(-1);
    const [creating, setCreating] = useState(false)
    const [metersList, setMetersList] = useState([]);

    // Form values
    const [formData, setFormData] = useState({
        rpId: "",
        meterId: "",
        address: "",
        id: ""
    });

    // Effect for getting data from API
    useEffect(() => {
        const fetchUserData = async () => {
            // Try getting user 
            const result = await axios.get(process.env.REACT_APP_API_URL + "User/" + userData.userId);

            let meterData = []

            // Add meters to list
            result.data.userMeters.forEach((meter) => {
                const meterObject = {
                    id: meter.id,
                    rpId: meter.rpId,
                    meterId: meter.meterDeviceId,
                    address: meter.address
                }

                meterData.push(meterObject);
            });

            setMetersList(meterData);
        }

        // Fetch the data when id is valid
        if (userData.userId !== -1 && userData.userId !== undefined) {
            fetchUserData();
        }
    }, [userData]);

    // Update forms
    function onChange(event) {
        const newFormData = {...formData};
        switch (event.target.name) {
            case "address":
                newFormData.address = event.target.value;
                break;
            case "RpId":
                newFormData.rpId = event.target.value;
                break;
            case "MeterId":
                newFormData.meterId = event.target.value;
                break;
            default:
                break;
        }

        setFormData(newFormData);
    }

    // Handle form edit
    async function handleEdit(event) {
        event.preventDefault();
        // Check if meter with these id's exists
        const meterResponse = await axios.get(process.env.REACT_APP_API_URL + "Meter");

        const foundMeter = meterResponse.data.find((meter) => meter.meterDeviceId === formData.meterId && meter.rpId === formData.rpId);

        if (foundMeter === undefined) {
            // No meter was found
            Store.addNotification({
                title: "Meter not found.",
                message: `The combination ${formData.meterId}, ${formData.rpId} doesn't exist.`,
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 500000,
                  onScreen: true,
                  pauseOnHover: true
                }    
            });
        } else {
            // Construct dto for PUT action
            const userMeterDto = {
                "meterId": foundMeter.id,
                "rpId": formData.rpId,
                "meterDeviceId": formData.meterId,
                "userId": userData.userId,
                "address": formData.address,
            }
            const resp = await axios.put(process.env.REACT_APP_API_URL + "UserMeter/" + formData.id, userMeterDto);
            
            // Good put?
            if (resp.status === 204) {
                // Try to find meter in current list
                const meterIndex = metersList.findIndex((meter) => meter.meterId === formData.meterId && meter.rpId === formData.rpId);
                if (meterIndex !== -1) {
                    // Uppdate meter
                    const newMetersList = [...metersList];

                    userMeterDto.meterId = userMeterDto.meterDeviceId;
                    delete userMeterDto.meterDeviceId;

                    newMetersList[meterIndex] = userMeterDto;

                    setMetersList(newMetersList);
                }
            }
        }

        setEditing(false);
    }

    // Cancel edit and clear form
    function cancelEdit(event) {
        event.preventDefault();

        setFormData({
            rpId: "",
            meterId: "",
            address: "",
            id: ""
        });

        setEditing(false);
    }

    // Set form data
    function triggerEdit(index) {
        const meterData = [...metersList][index];

        setFormData(meterData);
        setCreating(false);
        setEditing(true);
        setIndexBeingEdited(index);
    }

    // Handle delete, show error and stuff
    async function handleDelete(index) {
        if (!window.confirm("Are you sure you want to remove this meter?")) {
            return;
        }

        const newList = [...metersList];
        const removalId = newList[index].id;
        newList.splice(index, 1)

        await axios.delete(process.env.REACT_APP_API_URL + "UserMeter/" + removalId);

        setMetersList(newList);
    }

    async function handleCreate(event) {
        event.preventDefault();
        const newData = {
            rpId: event.target.RpId.value.trim(),
            meterId: event.target.MeterId.value.trim(),
            address: event.target.address.value
        };

        // Try to find meter with RpId and MeterId
        const meterResponse = await axios.get(process.env.REACT_APP_API_URL + "Meter");

        const foundMeter = meterResponse.data.find((meter) => meter.meterDeviceId === newData.meterId && meter.rpId === newData.rpId);

        if (foundMeter === undefined) {
            Store.addNotification({
                title: "Meter not found.",
                message: `The combination ${formData.meterId}, ${formData.rpId} does not exist.`,
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 5000,
                  onScreen: true,
                  pauseOnHover: false
                }    
            });
        } else {
            // Meter was found check if already in list
            var meterInList = metersList.find((meter) => meter.rpId === newData.rpId && meter.meterDeviceId === newData.meterId);

            if (meterInList === undefined) {
                // Add user to userMeter table
                const userMeterDto = {
                    rpId: newData.rpId,
                    meterId: foundMeter.id,
                    meterDeviceId: newData.meterId,
                    userId: userData.userId,
                    address: newData.address,
                }

                await axios.post(process.env.REACT_APP_API_URL + "UserMeter", userMeterDto)
                    .then(res => {
                        const newMetersList = [...metersList];

                        const newMeter = {
                            rpId: res.data.rpId,
                            meterId: res.data.meterDeviceId,
                            address: res.data.address
                        }
                        newMetersList.push(newMeter);

                        setMetersList(newMetersList);
                        setCreating(false);

                        Store.addNotification({
                            title: "Meter was added!",
                            message: `Your meter has been successfully configured.`,
                            type: "success",
                            insert: "top",
                            container: "top-right",
                            animationIn: ["animate__animated", "animate__fadeIn"],
                            animationOut: ["animate__animated", "animate__fadeOut"],
                            dismiss: {
                              duration: 5000,
                              onScreen: true,
                              pauseOnHover: false
                            }
                            
                        });
                    });
            } else {
                Store.addNotification({
                    title: "Meter already exists.",
                    message: `This meter has already been added.`,
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true,
                      pauseOnHover: false
                    }    
                });
            }
        }
    }

    // Cancel creation
    function handleCancel(event) {
        event.preventDefault();
        setCreating(false);
        setEditing(false);
        setIndexBeingEdited(-1);
    }

    return (
        <div className="w-full relative">
            <ReactNotifications className="!relative"/>
            <form onSubmit={handleEdit}>
                <table className="border-collapse">
                    <thead className="border-b bg-gray-600">
                    <tr className="w-full">

                        <th className="text-md font-bold text-white px-6 py-6 text-left w-[40%]">
                            <div className="flex ">
                                Raspberry ID
                                <div className="scale-[0.7] -mt-2 ml-1 cursor-pointer ">
                             <span style={{ marginTop: '-100px' }} title="Fill in the code that was provided to you (sticker)"  >
                                {icons[icons.findIndex(i => i.name === "InfoOutlined")].icon}
                            </span>

                                </div>
                            </div>
                        </th>
                        <th className="text-md font-bold text-white px-6 py-6 text-left w-[30%]">
                            <div className="flex ">
                                Meter ID
                                <div className="scale-[0.7] -mt-2 ml-1 cursor-pointer ">
                             <span style={{ marginTop: '-100px' }} title="Fill in the id of the digital meter where you plugged the raspberry pi in. You can find this on the front of your meter. Example: 1SAGXXXXXXXXXX"  >
                                {icons[icons.findIndex(i => i.name === "InfoOutlined")].icon}
                            </span>
                                </div>
                            </div>

                        </th>
                        <th className="text-md font-bold text-white px-6 py-6 text-left w-[30%]">Address</th>
                        <th className="text-md font-bold text-white px-6 py-6 text-left w-[10%]">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {metersList.map((row, index) => (
                        <tr key={row.rpId} className="bg-white border-b w-full">

                            {editing && indexBeingEdited === index ? (
                                <>
                                    <td className="text-md text-gray-900 font-light px-6 py-4 w-[40%]">
                                        <input className="w-full" type="text" name="RpId" placeholder="Raspberry ID"
                                               defaultValue={formData.rpId} onChange={(event) => onChange(event)}/>
                                    </td>
                                    <td className="text-md text-gray-900 font-light px-6 py-4 w-[30%]">
                                        <input className="w-full" type="text" name="MeterId" placeholder="Meter ID"
                                               defaultValue={formData.meterId} onChange={(event) => onChange(event)}/>
                                    </td>
                                    <td className="text-md text-gray-900 font-light px-6 py-4 w-[30%]">
                                        <input className="w-full" type="text" name="address" placeholder="Address"
                                               defaultValue={formData.address} onChange={(event) => onChange(event)}/>
                                    </td>
                                    <td className="text-md text-gray-900 font-light px-6 py-4 w-[10%]">
                                        <div className="flex gap-4">
                                            <button className="text-delete hover:text-deleteHover"
                                                    onClick={(event) => cancelEdit(event)}
                                            >{icons[icons.findIndex(i => i.name === "cancel")].icon}</button>
                                            <button className="text-save hover:text-saveHover"
                                                    type="submit">{icons[icons.findIndex(i => i.name === "save")].icon}</button>
                                        </div>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="text-md text-gray-900 font-light px-6 py-4 w-[40%]">{row.rpId}</td>
                                    <td className="text-md text-gray-900 font-light px-6 py-4 w-[30%]">{row.meterId}</td>
                                    <td className="text-md text-gray-900 font-light px-6 py-4 w-[30%]">{row.address}</td>
                                    <td className="text-md text-gray-900 font-light px-6 py-4 w-[10%]">
                                        <div className="flex gap-4">
                                            <button className="text-save hover:text-saveHover" onClick={(event) => {
                                                event.preventDefault();
                                                triggerEdit(index)
                                            }}>{icons[icons.findIndex(i => i.name === "edit")].icon}</button>
                                            <button className="text-delete hover:text-deleteHover" onClick={(event) => {
                                                event.preventDefault();
                                                handleDelete(index)
                                            }}>{icons[icons.findIndex(i => i.name === "delete")].icon}</button>
                                        </div>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </form>


            {!creating && !editing && (
                <div className="flex flex-col w-full mt-2">
                    <button className="bg-create text-uiLight rounded-md p-2 self-end mr-4"
                            onClick={() => setCreating(true)}>Create New
                    </button>
                </div>
            )}
            {creating && (
                <form className="mt-5 flex flex-col" onSubmit={handleCreate}>
                    <label className="mx-4">Address</label>
                    <input className="mx-2 text-sm p-2 mb-1" type="text" name="address" placeholder="Address"
                           defaultValue={formData.addres}/>

                    <div className="grid mx-2 grid-cols-6 gap-2">
                        <div className="w-full text-sm col-span-4">
                            <label className="mx-2 text-base">Raspberry ID</label>
                            <input className="w-full p-2" type="text" name="RpId" placeholder="Raspberry ID"
                                   defaultValue={formData.rpId}/>
                        </div>
                        <div className="w-full text-sm col-span-2">
                            <label className="mx-2 text-base">Meter ID</label>
                            <input className="w-full p-2" type="text" name="MeterId" placeholder="Meter ID"
                                   defaultValue={formData.meterId}/>
                        </div>
                    </div>

                    <div className="self-end mt-2 mr-4 flex gap-2">
                        <button className="bg-delete text-uiLight rounded-md w-[4rem] h-[2.5rem]" type="button"
                                onClick={(event) => handleCancel(event)}>Cancel
                        </button>
                        <button className="bg-save text-uiLight rounded-md w-[4rem] h-[2.5rem]" type="submit">Create
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default MeterList;