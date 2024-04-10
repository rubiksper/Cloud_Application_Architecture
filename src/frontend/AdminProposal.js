import React, { useState, useEffect } from 'react';
import { getProposals, approveProposal, rejectProposal } from '../backend/api';
import '../style/adminDashboard.css';

function AdminDashboard() {
  const [proposals, setProposals] = useState([]);
  const [modalContent, setModalContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const proposalsData = await getProposals();
      setProposals(proposalsData);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  const handleApproveProposal = async (id, name, address, description, latitude, longitude) => {
    try {
      await approveProposal(id, name, address, description, latitude, longitude);
      const updatedProposals = proposals.filter(proposal => proposal.id !== id);
      setProposals(updatedProposals);
      setSuccessMessage('Proposal approved successfully');
    } catch (error) {
      console.error('Error approving proposal:', error);
    }
  };

  const handleRejectProposal = async (id) => {
    try {
      await rejectProposal(id);
      const updatedProposals = proposals.filter(proposal => proposal.id !== id);
      setProposals(updatedProposals);
      setSuccessMessage('Proposal rejected successfully');
    } catch (error) {
      console.error('Error rejecting proposal:', error);
    }
  };

  const openModal = (content) => {
    if (showModal && modalContent === content) {
      closeModal();
    } else {
      setModalContent(content);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSuccessMessage('');
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <h2>Location Proposals</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Description</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map(proposal => (
            <tr key={proposal.id}>
              <td>
                {proposal.Nom.length > 20 ? (
                  <span style={{ cursor: 'pointer' }} onClick={() => openModal(proposal.Nom)}>
                    {proposal.Nom.substring(0, 20)}...
                  </span>
                ) : (
                  proposal.Nom
                )}
              </td>
              <td>
                {proposal.Adresse.length > 30 ? (
                  <span style={{ cursor: 'pointer' }} onClick={() => openModal(proposal.Adresse)}>
                    {proposal.Adresse.substring(0, 30)}...
                  </span>
                ) : (
                  proposal.Adresse
                )}
              </td>
              <td>
                {proposal.Description.length > 50 ? (
                  <span style={{ cursor: 'pointer' }} onClick={() => openModal(proposal.Description)}>
                    {proposal.Description.substring(0, 50)}...
                  </span>
                ) : (
                  proposal.Description
                )}
              </td>
              <td onClick={() => openModal(proposal.latitude)} style={{ cursor: 'pointer' }}>
                {proposal.latitude.length > 15 ? (
                  <span>
                    {proposal.latitude.substring(0, 15)}...
                  </span>
                ) : (
                  proposal.latitude
                )}
              </td>
              <td onClick={() => openModal(proposal.longitude)} style={{ cursor: 'pointer' }}>
                {proposal.longitude.length > 15 ? (
                  <span>
                    {proposal.longitude.substring(0, 15)}...
                  </span>
                ) : (
                  proposal.longitude
                )}
              </td>

              <td>{proposal.user_name}</td>
              <td>
                <button onClick={() => handleApproveProposal(proposal.id, proposal.Nom, proposal.Adresse, proposal.Description, proposal.latitude, proposal.longitude)}>Approve</button><br /><br />
                <button onClick={() => handleRejectProposal(proposal.id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <a href="/AdminHouse" className="back-to-map-button">Back to Map</a>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <p>{modalContent}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
