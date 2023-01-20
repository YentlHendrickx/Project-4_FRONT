import React, { useEffect, useState } from "react";
import {icons} from "../icons";
import axios from 'axios';
// import './table.css';


function MeterList() {

  
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(process.env.REACT_APP_API_URL + "Meter" );
      console.log(result.data)
    }

    fetchData();

   }, []);
 

  
  const [data, setData] = useState([
    { RpId: 1, MeterId: 1001, address: '123 Main St' },
    { RpId: 2, MeterId: 1002, address: '456 Park Ave' },
    { RpId: 3, MeterId: 1003, address: '789 Elm St' }
  ]);

  const [editing, setEditing] = useState(false);
  const [indexBeingEdited, setIndexBeingEdited] = useState(-1);
  const [creating, setCreating] = useState(false)

  function handleEdit(index) {
    setEditing(true);
    setIndexBeingEdited(index);
  }

  function handleDelete(index) {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const newData = [...data];

    newData[indexBeingEdited] = {
      RpId: event.target.RpId.value,
      MeterId: event.target.MeterId.value,
      address: event.target.address.value
    };

    setData(newData);
    setEditing(false);
  }

  function handleCreate(event) {
    event.preventDefault();
    const newData = [...data];
    newData.push({
        RpId: event.target.RpId.value,
        MeterId: event.target.MeterId.value,
        address: event.target.address.value
    });

    

    setData(newData);
  }

  function handleCancel(event){
    setCreating(false)
    setEditing(false)
    setIndexBeingEdited(-1)
  }

  return (
    <div className="m-10 flex flex-col items-center">
      <table className="w-[90%]">
        <thead className="bg-uiNav text-uiLight">
          <tr className="border border-uiNav">
            <th >RpId</th>
            <th>MeterId</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody >
          {data.map((row, index) => (
            <tr key={row.RpId} className="border border-uiNav">
              <td className="text-center">{row.RpId}</td>
              <td className="text-center">{row.MeterId}</td>
              <td className="text-center">{row.address}</td>
              <td className="text-center">
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
                    <button className="text-edit" onClick={() => handleEdit(index)}>{icons[8].icon}</button>
                    <button className="text-delete" onClick={() => handleDelete(index)}>{icons[9].icon}</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="bg-uiNav text-uiLight rounded-3xl  p-3 my-4 mx-auto" onClick={() => setCreating(true)}>Create New</button>
      {creating && (
        <form className="create-form" onSubmit={handleCreate}>
          <input type="number" name="RpId" placeholder="RpId" />
          <input type="number" name="MeterId" placeholder="MeterId" />
          <input type="text" name="address" placeholder="Address" />
          <button type="submit">Save</button>
          <button type="button" onClick={() => handleCancel()}>Cancel</button>
        </form>
      )}
    </div>
  );
}

export default MeterList;