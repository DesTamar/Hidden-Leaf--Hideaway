import React from 'react'

const DeleteSpot = ({deleteType}) => {
  return (
    <>
    <h1>Confirm Delete</h1>
    <p>Are you sure you want to delete this {deleteType}?</p>
    <button>Yes</button>
    <button>No</button>
    </>
  )
}

export default DeleteSpot