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
        <thead className="border-b bg-uiSecondaryLight">
          <tr>
            <th className="text-sm font-medium text-white px-6 py-4 text-left">RpId</th>
            <th className="text-sm font-medium text-white px-6 py-4 text-left">MeterId</th>
            <th className="text-sm font-medium text-white px-6 py-4 text-left">Address</th>
            <th className="text-sm font-medium text-white px-6 py-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody >
          {metersList.map((row, index) => (
            <tr key={row.rpId} className="bg-white border-b">
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{row.rpId}</td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{row.meterId}</td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{row.address}</td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {editing && indexBeingEdited === index ? (
                  <form onSubmit={handleSubmit}>
                    <input
                      type="number"
                      name="RpId"
                      defaultValue={row.RpId}
                    />
                    <input
                      type="number"
                      name="MeterId"
                      defaultValue={row.MeterId}
                    />
                    <input
                      type="text"
                      name="address"
                      defaultValue={row.address}
                    />
                    <button type="submit">Save</button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
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
      <button className="bg-uiPrimary text-uiLight rounded-md  p-3 my-4 mx-auto" onClick={() => setCreating(true)}>Create New</button>
      {creating && (
        <form className="create-form" onSubmit={handleCreate}>
          <input type="text" name="RpId" placeholder="RpId" defaultValue={formData.rpId}/>
          <input type="text" name="MeterId" placeholder="MeterId" defaultValue={formData.meterId} />
          <input type="text" name="address" placeholder="Address" defaultValue={formData.addres} />
          <button type="submit">Save</button>
          <button type="button" onClick={(event) => handleCancel(event)}>Cancel</button>
        </form>
      )}
    </div>
  );
}

export default MeterList;