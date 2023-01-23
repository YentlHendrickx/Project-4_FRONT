import React, { useEffect, useState } from "react";
import {icons} from "../icons";
import axios from 'axios';

// Recoil
import { useRecoilValue } from "recoil";
import { userDataState } from "../store";

function MeterList() {

  const userData = useRecoilValue(userDataState);
  const [editing, setEditing] = useState(false);
  const [indexBeingEdited, setIndexBeingEdited] = useState(-1);
  const [creating, setCreating] = useState(false)
  const [metersList, setMetersList] = useState([
  ]);

  const [meterFound, setMeterFound] = useState(false);
  const [meterExists, setMeterExists] = useState(false);

  const [formData, setFormData] = useState({
    rpId: "",
    meterId: "",
    addres: ""
  });


  // Effect for getting data from API
  useEffect(() => {
    const fetchUserData = async () => {
      // const client = axios.create({
      //   baseURL: process.env.REACT_APP_API_URL,
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('token')}`
      //   }
      // })

      const result = await axios.get(process.env.REACT_APP_API_URL + "User/" + userData.userId);

      let meterData = []

      result.data.userMeters.map((meter) => {
          const meterObject = {
            id:       meter.id,
            rpId:     meter.rpId,
            meterId:  meter.meterDeviceId,
            address:  meter.address
          }

          meterData.push(meterObject);
      });

      setMetersList(meterData);
    }

    if (userData.userId !== -1 && userData.userId !== undefined) {      
      fetchUserData();
    }
  }, [userData]);


  function handleEdit(index) {
    setCreating(false);
    setEditing(true);
    setIndexBeingEdited(index);
  }

  async function handleDelete(index) {
    const newList = [...metersList];
    const removalId = newList[index].id;
    newList.splice(index, 1)

    await axios.delete(process.env.REACT_APP_API_URL + "UserMeter/" + removalId);

    setMetersList(newList);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const newData = [...metersList];

    newData[indexBeingEdited] = {
      RpId: event.target.RpId.value,
      MeterId: event.target.MeterId.value,
      address: event.target.address.value
    };

    // setData(newData);
    setEditing(false);
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
      setMeterFound(false);
    } else {
      // Meter was found check if already in list
      var meterInList = metersList.find((meter) => meter.rpId === newData.rpId && meter.meterDeviceId === newData.meterId);

      meterInList = undefined;
      if (meterInList === undefined) {
        // Add user to userMeter table
        const userMeterDto = {
          meterId: foundMeter.id,
          rpId: newData.rpId,
          meterDeviceId: newData.meterId,
          userId: userData.userId,
          address: newData.address,
        }

        await axios.post(process.env.REACT_APP_API_URL + "UserMeter",  userMeterDto)
        .then(res => {
          const newMetersList = [...metersList];

          const newMeter = {
            rpId: res.data.rpId,
            meterId: res.data.meterDeviceId,
            address: res.data.address
          }
          newMetersList.push(newMeter);

          setMeterExists(false);
          setMetersList(newMetersList);
        });
      } else {
        setMeterExists(true);
      }
    }
  }

  // Cancel creation
  function handleCancel(event){
    event.preventDefault();
    setCreating(false);
    setEditing(false);
    setIndexBeingEdited(-1);
  }

  return (
    <div className="w-full">
      <table className="min-w-full">
        <thead className="border-b bg-gray-600">
          <tr>
            <th className="text-md font-bold text-white px-6 py-6 text-left">Raspberry ID</th>
            <th className="text-md font-bold text-white px-6 py-6 text-left">Meter ID</th>
            <th className="text-md font-bold text-white px-6 py-6 text-left">Address</th>
            <th className="text-md font-bold text-white px-6 py-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody >
          {metersList.map((row, index) => (
            <tr key={row.rpId} className="bg-white border-b">

              {editing && indexBeingEdited === index ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="RpId"
                      placeholder="Raspberry ID"
                      defaultValue={formData.rpId}
                    />
                  </td>
                  <td>
                    <input
                      
                        type="text"
                        name="MeterId"
                        placeholder="Meter ID"
                        defaultValue={formData.meterId}
                      />
                  </td>
                  <td>
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        defaultValue={formData.address}
                      />
                  </td>
                  <td>
                    <div className="self-end mt-2 mr-4 flex gap-2">
                      <button className="bg-delete text-uiLight rounded-md w-[4rem] h-[2.5rem]" type="button" onClick={(event) => setEditing(false)}>Cancel</button>
                      <button className="bg-save text-uiLight rounded-md w-[4rem] h-[2.5rem]" type="submit">Save</button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap">{row.rpId}</td>
                  <td className="text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap">{row.meterId}</td>
                  <td className="text-md text-gray-900 font-light px-6 py-4 whitespace-nowrap">{row.address}</td>
                </>
              )}

              <td className="text-md text-gray-900 font-light px-6 py-4">
                {!editing && (
                  <>
                    <button className="text-edit" onClick={() => handleEdit(index)}>{icons[icons.findIndex(i => i.name === "edit")].icon}</button>
                    <button className="text-delete" onClick={() => handleDelete(index)}>{icons[icons.findIndex(i => i.name === "delete")].icon}</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!creating && !editing && (
        <div className="flex flex-col w-full">
          <button className="bg-create text-uiLight rounded-md p-2 self-end mr-4" onClick={() => setCreating(true)}>Create New</button>
        </div>
      )}
      {creating && (
        <form className="mt-5 flex flex-col" onSubmit={handleCreate}>
          <label className="mx-4">Address</label>
          <input className="mx-2 text-sm p-2 mb-1" type="text" name="address" placeholder="Address" defaultValue={formData.addres} />

          <div className="grid mx-2 grid-cols-6 gap-2">
            <div className="w-full text-sm col-span-4">
              <label className="mx-2 text-base">Raspberry ID</label>
              <input className="w-full p-2" type="text" name="RpId" placeholder="Raspberry ID" defaultValue={formData.rpId}/>
            </div>
            <div className="w-full text-sm col-span-2">
              <label className="mx-2 text-base">Meter ID</label>
              <input className="w-full p-2" type="text" name="MeterId" placeholder="Meter ID" defaultValue={formData.meterId} />
            </div>
          </div>

          <div className="self-end mt-2 mr-4 flex gap-2">
            <button className="bg-delete text-uiLight rounded-md w-[4rem] h-[2.5rem]" type="button" onClick={(event) => handleCancel(event)}>Cancel</button>
            <button className="bg-save text-uiLight rounded-md w-[4rem] h-[2.5rem]" type="submit">Create</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default MeterList;