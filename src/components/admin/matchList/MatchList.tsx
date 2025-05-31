// src/components/admin/MatchList.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, Paper, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import useMatches from '../../../hooks/useMatches';
import LoadingSpinner from '../../core/LoadingSpinner';
import MatchListItem from './MatchListItem'; // This will be created next
import ConfirmationDialog from '../../common/ConfirmationDialog';
import matchService from '../../../services/matchService';
import type { Match } from '../../../types/match';


function MatchList() {
  const { matches, loading, error, fetchMatches, removeMatch } = useMatches();
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [matchToDelete, setMatchToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteClick = (matchId: string) => {
    setMatchToDelete(matchId);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (matchToDelete) {
      setDeleteError(null);
      try {
        await matchService.deleteMatch(matchToDelete);
        removeMatch(matchToDelete); // Update state in hook
        setDialogOpen(false);
        setMatchToDelete(null);
      } catch (err: any) {
        setDeleteError(err.message || 'Failed to delete match.');
        console.error("Delete match error:", err);
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setMatchToDelete(null);
    setDeleteError(null);
  };

  if (loading) return <LoadingSpinner />
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Tournament Matches
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          component={Link}
          to="/admin/matches/new" // Route to create new match
        >
          Create New Match
        </Button>
      </Box>

      {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}

      {matches.length === 0 ? (
        <Alert severity="info">No matches found. Start by creating a new one!</Alert>
      ) : (
        <Paper elevation={1}>
          <List>
            {matches.map((match:Match) => (
              <MatchListItem
                key={match.id}
                match={match}
                onDelete={handleDeleteClick}
                // Add more handlers like onEdit, onManageLive if needed
              />
            ))}
          </List>
        </Paper>
      )}

      <ConfirmationDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this match? This action cannot be undone."
        confirmButtonText="Delete"
      />
    </Box>
  );
}

export default MatchList;