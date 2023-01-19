import React, { useState } from "react";
import './table.css';


function MeterList() {
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
    <div>
      <table>
        <thead>
          <tr>
            <th>RpId</th>
            <th>MeterId</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.RpId}>
              <td>{row.RpId}</td>
              <td>{row.MeterId}</td>
              <td>{row.address}</td>
              <td className="actions">
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
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="create-new" onClick={() => setCreating(true)}>Create New</button>
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