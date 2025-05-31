// src/components/admin/TeamManagement.tsx
import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Alert } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useTeams from '../../../hooks/useTeams';
import LoadingSpinner from '../../core/LoadingSpinner';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import teamService from '../../../services/teamService';
import TeamFormModal from './TeamFormModal'; // Will create this next
import ErrorDisplay from '../../common/ErrorDisplay';
import type { Team } from '../../../types/team';

function TeamManagement() {
  const { teams, loading, error, fetchTeams, addTeam, updateTeamInList, removeTeam } = useTeams();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null); // Team object being edited

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleAddClick = () => {
    setEditingTeam(null); // Clear any editing state
    setModalOpen(true);
  };

  const handleEditClick = (team: Team) => {
    setEditingTeam(team);
    setModalOpen(true);
  };

  const handleDeleteClick = (teamId: string) => {
    setTeamToDelete(teamId);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (teamToDelete) {
      setDeleteError(null);
      try {
        await teamService.deleteTeam(teamToDelete);
        removeTeam(teamToDelete); // Update state in hook
        setDialogOpen(false);
        setTeamToDelete(null);
      } catch (err: any) {
        setDeleteError(err.message || 'Failed to delete team. It might have associated players or matches.');
        console.error("Delete team error:", err);
      }
    }
  };

  const handleModalClose = (team?: Team) => {
    if (team) { // If a team object is returned, it means it was added/updated
      if (editingTeam) {
        updateTeamInList(team);
      } else {
        addTeam(team);
      }
    }
    setModalOpen(false);
    setEditingTeam(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setTeamToDelete(null);
    setDeleteError(null);
  };


  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchTeams} title={''} />;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Team Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddClick}
        >
          Add New Team
        </Button>
      </Box>

      {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}

      {teams.length === 0 ? (
        <Alert severity="info">No teams found. Add your tournament teams here!</Alert>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Team Name</TableCell>
                <TableCell>Captain</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.captainName || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <IconButton aria-label="edit" onClick={() => handleEditClick(team)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDeleteClick(team.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TeamFormModal
        open={modalOpen}
        onClose={handleModalClose}
        editingTeam={editingTeam}
      />
      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleConfirmDelete}
        title="Confirm Team Deletion"
        message="Are you sure you want to delete this team? This action cannot be undone and may affect associated players or matches."
        confirmButtonText="Delete"
      />
    </Box>
  );
}

export default TeamManagement;