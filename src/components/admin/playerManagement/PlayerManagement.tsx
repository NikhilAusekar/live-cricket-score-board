// src/components/admin/PlayerManagement.tsx
import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Alert } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import usePlayers from '../../../hooks/usePlayers';
import useTeams from '../../../hooks/useTeams';
import playerService from '../../../services/playerService';
import ConfirmationDialog from '../../common/ConfirmationDialog';
import PlayerFormModal from './PlayerFormModal';
import ErrorDisplay from '../../common/ErrorDisplay';
import LoadingSpinner from '../../core/LoadingSpinner';
import type { Player } from '../../../types/palyer';

function PlayerManagement() {
  const { players, loading, error, fetchPlayers, addPlayer, updatePlayerInList, removePlayer } = usePlayers();
  const { teams, loading: teamsLoading, error: teamsError,fetchTeams } = useTeams(); // Fetch teams for display

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleAddClick = () => {
    setEditingPlayer(null);
    setModalOpen(true);
  };

  const handleEditClick = (player: Player) => {
    setEditingPlayer(player);
    setModalOpen(true);
  };

  const handleDeleteClick = (playerId: string) => {
    setPlayerToDelete(playerId);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (playerToDelete) {
      setDeleteError(null);
      try {
        await playerService.deletePlayer(playerToDelete);
        removePlayer(playerToDelete);
        setDialogOpen(false);
        setPlayerToDelete(null);
      } catch (err: any) {
        setDeleteError(err.message || 'Failed to delete player. They might be associated with matches.');
        console.error("Delete player error:", err);
      }
    }
  };

  const handleModalClose = (player?: Player) => {
    if (player) {
      if (editingPlayer) {
        updatePlayerInList(player);
      } else {
        addPlayer(player);
      }
    }
    setModalOpen(false);
    setEditingPlayer(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setPlayerToDelete(null);
    setDeleteError(null);
  };

  if (loading || teamsLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchPlayers} title={''} />;
  if (teamsError) return <ErrorDisplay message={teamsError} onRetry={fetchTeams} title={""} />; // Can retry fetching teams

  // Map player teamId to teamName for display
  const playersWithTeamNames = players.map(player => ({
    ...player,
    teamName: teams.find(team => team.id === player.teamId)?.name || 'Unknown Team',
  }));

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Player Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddClick}
        >
          Add New Player
        </Button>
      </Box>

      {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}

      {players.length === 0 ? (
        <Alert severity="info">No players found. Add players to your teams!</Alert>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Player Name</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playersWithTeamNames.map((player:Player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.teamName}</TableCell>
                  <TableCell>{player.role}</TableCell>
                  <TableCell align="right">
                    <IconButton aria-label="edit" onClick={() => handleEditClick(player)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDeleteClick(player.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <PlayerFormModal
        open={modalOpen}
        onClose={handleModalClose}
        editingPlayer={editingPlayer}
        teams={teams} // Pass teams for dropdown
        teamsLoading={teamsLoading}
        teamsError={teamsError}
      />
      <ConfirmationDialog   
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleConfirmDelete}
        title="Confirm Player Deletion"
        message="Are you sure you want to delete this player? This action cannot be undone."
        confirmButtonText="Delete"
      />
    </Box>
  );
}

export default PlayerManagement;